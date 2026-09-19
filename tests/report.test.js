import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore, rankStatus, areas } from '../src/scoreCalculator.js';
import { generateReport, reportToText, keywordAnalysis } from '../src/reportGenerator.js';
import { industryTemplates } from '../src/industryTemplates.js';

const inputFor = (level = 'average') => ({ business: '테스트 업체', industry: '음식점', region: '신림', url: '', memo: '', ratings: Object.fromEntries(areas.map(area => [area.id, level])), keywords: [], strengths: [], problems: [] });

test('점수: 전체 좋음 100, 보통 60, 미흡 25 및 소수점 배점 보존', () => {
  assert.equal(calculateScore(inputFor('good').ratings), 100);
  assert.equal(calculateScore(inputFor('average').ratings), 60);
  assert.equal(calculateScore(inputFor('poor').ratings), 25);
  assert.equal(calculateScore({ ...inputFor('good').ratings, content: 'poor' }), 88.75);
  assert.equal(calculateScore({}), null);
});

test('순위 구간의 경계 및 순위 미확인', () => {
  for (const [value, expected] of [[1, '상위 노출'], [10, '상위 노출'], [11, '비교적 양호'], [20, '비교적 양호'], [21, '보완 필요'], [40, '보완 필요'], [41, '노출 약함'], [1000, '노출 약함'], [null, '노출 확인 어려움'], ['', '노출 확인 어려움'], [0, '노출 확인 어려움']]) assert.equal(rankStatus(value), expected);
});

test('모든 업종 및 평가 조합에서 우선 과제와 기회는 각각 3개, 강점은 2~4개', () => {
  for (const industry of Object.keys(industryTemplates)) {
    for (let combination = 0; combination < 729; combination++) {
      let value = combination;
      const input = inputFor();
      input.industry = industry;
      for (const area of areas) { input.ratings[area.id] = ['good', 'average', 'poor'][value % 3]; value = Math.floor(value / 3); }
      const report = generateReport(input);
      assert.equal(report.priorities.length, 3);
      assert.equal(report.opportunities.length, 3);
      assert.equal(new Set(report.priorities.map(item => item.title)).size, 3);
      assert.ok(report.positives.length >= 2 && report.positives.length <= 4);
      assert.ok(!reportToText(report).includes('undefined'));
    }
  }
});

test('미확인 순위는 상위 노출 또는 미노출로 단정하지 않음', () => {
  const input = inputFor();
  input.keywords = [{ keyword: '신림 곱창', rank: '1', unknown: true }];
  const report = generateReport(input);
  assert.equal(report.keywords[0].rank, null);
  assert.match(report.keywordAnalysis, /미노출을 뜻하지 않습니다/);
  assert.match(keywordAnalysis([]), /판단하지 않았습니다/);
});

test('문제점, 평가, 순위가 우선순위와 설명에 반영됨', () => {
  const input = inputFor('good');
  input.problems = ['브랜드블로그 없음', '블로그 노출 약함', '네이버클립 없음'];
  input.ratings.external = 'poor';
  input.keywords = [{ keyword: '신림 곱창', rank: '43', unknown: false }];
  const report = generateReport(input);
  assert.match(report.priorities[0].title, /외부 콘텐츠/);
  assert.match(report.priorities[1].title, /키워드/);
  assert.match(report.priorities[0].evidence, /브랜드블로그 없음/);
  assert.match(report.outlook, /브랜드블로그 없음/);
  assert.match(report.opportunities[0].description, /메뉴/);
});

test('근거 없는 강점은 지어내지 않고 추가 확인으로 표시', () => {
  const report = generateReport(inputFor('poor'));
  assert.ok(report.positives.every(item => /확인/.test(item.title)));
  const good = generateReport(inputFor('good'));
  assert.ok(good.priorities.every(item => /유지/.test(item.title)));
});

test('전체 복사에 메모, 업체 정보, 업종 문구와 마지막 지원 영역이 포함', () => {
  const input = inputFor('poor');
  input.industry = '학원·교육';
  input.memo = '첫째 줄\n둘째 줄';
  input.url = 'https://example.com/place';
  const text = reportToText(generateReport(input, new Date(2026, 8, 19)));
  assert.match(text, /교육 과정/);
  assert.match(text, /첫째 줄\n둘째 줄/);
  assert.match(text, /2026년 9월 19일/);
  assert.match(text, /https:\/\/example.com\/place/);
  assert.ok(text.lastIndexOf('지원 가능한 운영 영역') > text.indexOf('추가 메모'));
});
