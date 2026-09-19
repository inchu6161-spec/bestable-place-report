import { areas, levels, calculateScore, rankStatus } from './scoreCalculator.js';
import { strengths, problems } from './tags.js';
import { industryTemplates, services } from './industryTemplates.js';

export const internalNote = '순위 구간과 점수는 네이버 공식 기준이 아닌, 진단을 이해하기 쉽게 정리한 베스트에이블 내부 기준입니다. 직접 확인한 시점·위치·검색 환경에 따라 순위가 달라질 수 있으며, 검색 노출이나 매출 향상을 보장하지 않습니다.';
export const sectionTitles = ['업체 진단 개요', '핵심 키워드 노출 현황', '한눈에 보는 플레이스 상태', '현재 잘하고 있는 점', '현재 놓치고 있는 기회', '현재 상태가 지속될 경우', '지금 가장 먼저 해야 할 3가지', '업종별 권장 운영 방향'];

const tasks = {
  search: { title: '목표 키워드 중심 플레이스 정보 정비', detail: '지역과 실제 제공 서비스를 기준으로 카테고리, 소개글, 기본정보를 점검해 보세요. 목표 키워드와 안내 내용이 자연스럽게 연결되는지 확인하는 것이 우선입니다.', opportunity: '검색 의도와 업체 정보 연결', impact: '검색 고객이 원하는 정보와 업체의 실제 강점이 충분히 연결되지 않을 수 있습니다.' },
  content: { title: '대표사진과 서비스 콘텐츠 정리', detail: '대표사진과 최근 사진을 정리하고 주요 서비스와 가격 정보를 함께 안내해 보세요. 고객이 방문 전에 궁금해할 내용을 먼저 보여주는 것이 좋습니다.', opportunity: '첫인상에서 선택 이유 전달', impact: '비교 중인 고객이 현재 서비스와 업체의 특징을 이해하는 데 시간이 더 걸릴 수 있습니다.' },
  reviews: { title: '최근 리뷰 응대와 후기 강점 활용', detail: '최근 리뷰의 질문에 답하고 반복해서 언급되는 장점을 정리해 보세요. 실제 이용 고객의 자발적인 후기를 안내하고 확인된 경험을 콘텐츠에 반영하는 방향이 적합합니다.', opportunity: '고객 경험을 선택 정보로 활용', impact: '고객 경험에서 드러난 장점과 개선 의견을 운영에 충분히 반영하지 못할 수 있습니다.' },
  activity: { title: '최근 정보와 업데이트 일정 정비', detail: '사진, 소식, 영업시간과 서비스 정보를 확인하고 주 1회 점검 일정을 정해 보세요. 변경된 정보부터 반영하면 관리 부담을 줄이면서 정확성을 유지할 수 있습니다.', opportunity: '최근 운영 모습을 꾸준히 전달', impact: '고객이 최신 운영 정보를 확인하기 어려워 추가 문의가 필요할 수 있습니다.' },
  external: { title: '블로그·네이버 클립 등 외부 콘텐츠 보강', detail: '고객이 비교할 때 필요한 상세 정보를 한 가지 주제로 정리해 보세요. 블로그나 숏폼 중 관리할 수 있는 채널부터 시작하고 플레이스 안내와 내용을 맞추는 것이 좋습니다.', opportunity: '검색 이후의 비교 검토 지원', impact: '플레이스를 확인한 고객이 추가 비교에 필요한 상세 정보를 충분히 얻지 못할 수 있습니다.' },
  conversion: { title: '예약·문의 및 방문 안내 점검', detail: '전화, 예약, 톡톡 등 실제 사용하는 경로가 정상적으로 연결되는지 확인해 보세요. 가격과 이용 조건, 길찾기 정보를 함께 정리해 문의 전에 생기는 궁금증을 줄일 수 있습니다.', opportunity: '관심을 문의와 방문으로 연결', impact: '관심이 생긴 고객이 예약 방법이나 방문 조건을 다시 찾아야 할 수 있습니다.' },
};

export function keywordAnalysis(rows) {
  if (!rows.length) return '목표 키워드가 입력되지 않아 검색 노출 상태를 판단하지 않았습니다. 주요 서비스와 지역을 조합한 키워드를 정한 뒤 같은 조건에서 순위를 직접 확인해 보세요.';
  const known = rows.filter(row => row.rank !== null);
  const unknown = rows.length - known.length;
  if (!known.length) return `입력한 목표 키워드 ${rows.length}개의 순위가 모두 확인되지 않아 현재 노출 수준을 판단하기 어렵습니다. 순위 확인 안 됨은 미노출을 뜻하지 않습니다. 확인 가능한 키워드부터 검색 조건과 확인 날짜를 함께 기록해 보세요.`;
  const top = known.filter(row => row.rank <= 10).length;
  const weak = known.filter(row => row.rank > 20);
  let text = top === known.length
    ? `순위를 확인한 키워드 ${known.length}개가 모두 내부 기준상 상위 노출 구간에 있습니다. 현재 노출을 유지할 수 있도록 정보의 정확성과 최근 콘텐츠를 꾸준히 점검하는 방향이 적합합니다.`
    : top > 0
      ? `순위를 확인한 키워드 ${known.length}개 중 ${top}개가 상위 노출 구간에 있어 일부 검색 접점이 확인됩니다. 나머지 검색어는 현재 순위와 고객의 검색 의도를 함께 살펴 보완 대상을 정하는 것이 좋습니다.`
      : `순위를 확인한 키워드 ${known.length}개 중 상위 10위 이내 키워드는 없습니다. ${weak.length ? '목표 검색어와 플레이스 정보의 연결 상태를 점검하고 관련 콘텐츠를 보완하는 방향이 적합합니다.' : '확인한 키워드는 모두 11~20위로 비교적 양호하며, 주요 서비스 정보와 최근 콘텐츠를 꾸준히 정비하면 좋습니다.'}`;
  if (weak.length) text += ` 특히 ‘${weak[0].keyword}’(${weak[0].rank}위)는 ${rankStatus(weak[0].rank)} 구간으로 우선 점검할 수 있습니다.`;
  if (unknown) text += ` 순위 미확인 ${unknown}개는 노출 판단에서 제외했습니다.`;
  return text;
}

export function generateReport(input, now = new Date()) {
  const score = calculateScore(input.ratings);
  if (score === null) throw new Error('6개 진단 영역을 모두 선택해 주세요.');
  const template = industryTemplates[input.industry] || industryTemplates['기타'];
  const keywords = input.keywords.filter(row => row.keyword.trim()).map(row => ({ keyword: row.keyword.trim(), rank: row.unknown ? null : Number(row.rank) }));
  const selectedProblems = problems.filter(tag => input.problems.includes(tag.label));
  const selectedStrengths = strengths.filter(tag => input.strengths.includes(tag.label));
  const known = keywords.filter(row => row.rank !== null);
  const priorityAreas = areas.map((area, index) => {
    const tags = selectedProblems.filter(tag => tag.area === area.id).map(tag => tag.label);
    const rankWeight = area.id === 'search' && known.length ? Math.max(...known.map(row => row.rank > 40 ? 7 : row.rank > 20 ? 5 : row.rank > 10 ? 2 : 0)) : 0;
    const severity = { poor: 10, average: 5, good: 0 }[input.ratings[area.id]];
    return { ...area, tags, priority: severity + tags.length * 3 + rankWeight, index };
  }).sort((a, b) => b.priority - a.priority || a.index - b.index);

  const positives = selectedStrengths.slice(0, 4).map(tag => ({ title: tag.label, description: `${tag.detail}${selectedProblems.some(problem => problem.area === tag.area) ? ' 같은 영역의 보완 항목도 함께 확인해 강점을 유지하는 방향으로 정비하면 좋습니다.' : ''}` }));
  for (const area of areas) {
    if (positives.length >= 4) break;
    if (input.ratings[area.id] === 'good' && !selectedStrengths.some(tag => tag.area === area.id) && !selectedProblems.some(tag => tag.area === area.id)) {
      positives.push({ title: `${area.name}의 양호한 기반`, description: `직접 입력한 평가에서 ${area.name} 영역은 양호한 상태로 확인되었습니다. ${template.focus} 관련 정보와 연결해 현재 강점이 고객에게 잘 전달되는지 정기적으로 확인하면 좋습니다.` });
    }
  }
  const fallback = [
    { title: '강점 확인을 위한 추가 점검', description: '입력된 평가와 태그만으로는 확인된 강점을 충분히 설명하기 어렵습니다. 대표사진이나 최근 후기에서 고객에게 보여줄 수 있는 구체적인 사례를 확인한 뒤 강점으로 반영하는 것이 좋습니다.' },
    { title: '활용 가능한 자료 확인', description: '리뷰, 사진, 소개글 중 현재 활용할 수 있는 자료가 있는지 추가 확인이 필요합니다. 실제로 확인한 자료만 선택 이유와 연결해 정리하면 진단의 근거를 보강할 수 있습니다.' },
  ];
  while (positives.length < 2) positives.push(fallback[positives.length]);

  const topThree = priorityAreas.slice(0, 3);
  const priorities = topThree.map(area => ({
    title: area.priority ? tasks[area.id].title : `${area.name} 유지 및 정기 점검`,
    description: area.priority ? tasks[area.id].detail : `현재 입력에서 뚜렷한 개선 신호가 없어 유지 과제로 제안합니다. ${area.description}를 월 1회 확인하고 변경된 내용이 있을 때 반영해 보세요.`,
    evidence: `${levels[input.ratings[area.id]].label} 평가${area.tags.length ? ` · ${area.tags.join(', ')}` : ''}${area.id === 'search' && known.some(row => row.rank > 10) ? ' · 목표 키워드 순위 반영' : ''}`,
  }));
  const opportunities = topThree.map(area => ({
    title: tasks[area.id].opportunity,
    description: area.priority
      ? `${area.tags.length ? `선택된 ‘${area.tags.join(' · ')}’ 항목을 보완하면 ` : `${area.name} 영역을 정비하면 `}${template.focus} 정보를 고객의 선택 과정에 더 잘 활용할 수 있습니다. ${area.id === 'external' ? template.external : `${selectedStrengths.length ? `입력한 강점인 ‘${selectedStrengths[0].label}’도 관련 안내와 연결해 활용할 수 있는지 살펴보세요.` : '기존에 보유한 사진과 후기, 안내 자료가 있는지 확인하고 유효한 내용부터 활용하는 것이 좋습니다.'}`}`
      : `현재 입력만으로 이 영역에서 놓치고 있는 기회를 단정하기는 어렵습니다. ${template.focus}에 관한 고객 질문을 모아 기존 안내에서 더 쉽게 찾을 수 있도록 정리해 보세요.`,
  }));
  const weakAreas = priorityAreas.filter(area => area.priority > 0).slice(0, 2);
  const outlook = weakAreas.length
    ? `${weakAreas.map(area => `${area.tags.length ? `‘${area.tags[0]}’ 등 ${area.name}의 보완 사항이 유지되면 ` : `${area.name}의 현재 상태가 이어지면 `}${tasks[area.id].impact}`).join(' ')} 이는 입력한 진단에 따른 가능성이며 실제 고객 반응이나 검색 변화는 별도 확인이 필요합니다. 작은 항목부터 정비하고 변화를 기록해 보세요.`
    : '현재 입력에서는 뚜렷한 미흡 영역이나 문제점이 확인되지 않았습니다. 현재의 정보 정확성과 관리 수준을 유지하면서 고객 질문과 검색 변화를 정기적으로 확인하는 방향이 적합합니다. 이번 진단만으로 향후 검색 순위나 유입 변화를 예측할 수는 없습니다.';
  const direction = `첫째 주에는 ${template.action} 둘째 주에는 ‘${priorities[0].title}’ 과제를 중심으로 실제 고객이 확인하는 정보를 점검해 보세요. 셋째 주에는 ${input.ratings.external === 'good' && !selectedProblems.some(tag => tag.area === 'external') ? '현재 운영 중인 외부 콘텐츠의 정보가 플레이스와 일치하는지 확인하고 유효한 자료를 정리해 보세요.' : `${template.focus} 중 한 가지를 주제로 상세 콘텐츠를 준비하고 관리 가능한 채널에서 운영해 보세요.`} 넷째 주에는 같은 검색 조건으로 목표 키워드 순위를 직접 다시 기록하고 문의 내용과 정보 변경 사항을 함께 살펴보세요. 한 달 동안 확인한 변화에 따라 다음 달의 관리 우선순위를 조정하는 것이 좋습니다.`;

  return {
    business: input.business.trim(), industry: input.industry, region: input.region.trim(), url: input.url.trim(), memo: input.memo.trim(),
    date: new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(now), score, keywords,
    keywordAnalysis: keywordAnalysis(keywords),
    states: areas.map(area => ({ ...area, level: input.ratings[area.id], status: levels[input.ratings[area.id]].status })),
    positives, opportunities, outlook, priorities, direction,
  };
}

export function reportToText(report) {
  const heading = index => `${String(index + 1).padStart(2, '0')}. ${sectionTitles[index]}`;
  const items = list => list.map((item, index) => `${index + 1}. ${item.title}\n${item.description}${item.evidence ? `\n선정 근거: ${item.evidence}` : ''}`).join('\n\n');
  return [
    'BESTABLE | 네이버 플레이스 진단 리포트',
    `${heading(0)}\n업체명: ${report.business}\n업종: ${report.industry}\n지역: ${report.region}\n진단일: ${report.date}\n종합 진단 점수: ${report.score} / 100점${report.url ? `\n플레이스 URL: ${report.url}` : ''}`,
    `${heading(1)}\n키워드 | 현재 순위 | 상태\n${report.keywords.length ? report.keywords.map(row => `${row.keyword} | ${row.rank === null ? '순위 확인 안 됨' : `${row.rank}위`} | ${rankStatus(row.rank)}`).join('\n') : '입력된 키워드가 없습니다.'}\n\n${report.keywordAnalysis}\n${internalNote}`,
    `${heading(2)}\n${report.states.map(area => `${area.name}: ${area.status}`).join('\n')}`,
    `${heading(3)}\n${items(report.positives)}`,
    `${heading(4)}\n${items(report.opportunities)}`,
    `${heading(5)}\n${report.outlook}`,
    `${heading(6)}\n${items(report.priorities)}`,
    `${heading(7)}\n${report.direction}`,
    ...(report.memo ? [`추가 메모\n${report.memo}`] : []),
    `진단 결과에 따라 지원 가능한 운영 영역\n진단 결과 필요한 경우 아래 영역의 운영 지원이 가능합니다.\n${services.map(service => `${service.title}\n${service.description}`).join('\n\n')}`,
  ].join('\n\n');
}
