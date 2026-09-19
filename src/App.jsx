import React, { useRef, useState } from 'react';
import { areas, levels, calculateScore, rankStatus } from './scoreCalculator.js';
import { strengths, problemGroups } from './tags.js';
import { industryTemplates, services } from './industryTemplates.js';
import { generateReport, reportToText, internalNote, sectionTitles } from './reportGenerator.js';

const emptyKeyword = () => ({ keyword: '', rank: '', unknown: false });
const initialInput = () => ({ business: '', industry: '', region: '', url: '', memo: '', keywords: Array.from({ length: 3 }, emptyKeyword), ratings: {}, strengths: [], problems: [] });

function SectionHeading({ number, title, children }) {
  return <div className="section-heading"><span className="step-number">{number}</span><div><h2>{title}</h2>{children && <p>{children}</p>}</div></div>;
}

function ReportSection({ index, children }) {
  return <section className="report-section"><h3><span>{String(index + 1).padStart(2, '0')}</span>{sectionTitles[index]}</h3>{children}</section>;
}

function ReportItems({ items, numbered = false }) {
  return <div className={numbered ? 'recommendations' : 'report-items'}>{items.map((item, index) => <div className="report-item" key={item.title}>
    {numbered && <span className="priority-number">{index + 1}</span>}
    <div><h4>{item.title}</h4><p>{item.description}</p>{item.evidence && <small className="evidence">선정 근거: {item.evidence}</small>}</div>
  </div>)}</div>;
}

function Report({ report }) {
  return <article className="report-paper" id="report-document">
    <header className="paper-header"><span className="wordmark">BESTABLE<span className="logo-dot">.</span></span><span className="paper-label">PLACE INSIGHT REPORT</span>
      <p className="eyebrow">더 나은 고객 연결을 위한 첫걸음</p><h2>{report.business}<br/><span>플레이스 진단 리포트</span></h2><p className="paper-intro">현재의 강점을 확인하고, 다음 운영 방향을 제안합니다.</p>
      <div className="paper-meta"><span>{report.industry} · {report.region}</span><span>{report.date}</span></div>
    </header>
    <div className="paper-body">
      <ReportSection index={0}>
        <dl className="overview"><div><dt>업체명</dt><dd>{report.business}</dd></div><div><dt>업종</dt><dd>{report.industry}</dd></div><div><dt>지역</dt><dd>{report.region}</dd></div><div><dt>진단일</dt><dd>{report.date}</dd></div></dl>
        <div className="score-summary"><span>종합 진단 점수 <strong>{report.score}<small> / 100점</small></strong></span><span>6개 영역의 입력 평가 기준</span></div>
        {report.url && <p className="place-link"><a href={report.url} target="_blank" rel="noopener noreferrer">입력한 플레이스 주소 보기 ↗</a></p>}
        <p className="fine-print">이 리포트는 담당자가 직접 확인하고 입력한 내용을 바탕으로 작성되었습니다.</p>
      </ReportSection>
      <ReportSection index={1}>
        <div className="table-wrap"><table><thead><tr><th scope="col">키워드</th><th scope="col">현재 순위</th><th scope="col">상태</th></tr></thead><tbody>
          {report.keywords.length ? report.keywords.map((row, index) => <tr key={index}><td>{row.keyword}</td><td>{row.rank === null ? '순위 확인 안 됨' : <strong>{row.rank}위</strong>}</td><td><span className={`rank-status ${row.rank !== null && row.rank <= 20 ? 'positive' : ''}`}>{rankStatus(row.rank)}</span></td></tr>) : <tr><td colSpan="3">입력된 키워드가 없습니다.</td></tr>}
        </tbody></table></div><p className="analysis-box">{report.keywordAnalysis}</p><p className="fine-print">{internalNote}</p>
      </ReportSection>
      <ReportSection index={2}><div className="state-grid">{report.states.map(area => <div className="state-card" key={area.id}><span>{area.name}</span><strong className={`status-${area.level}`}><i/>{area.status}</strong></div>)}</div></ReportSection>
      <ReportSection index={3}><ReportItems items={report.positives}/></ReportSection>
      <ReportSection index={4}><ReportItems items={report.opportunities}/></ReportSection>
      <ReportSection index={5}><p className="outlook">{report.outlook}</p></ReportSection>
      <ReportSection index={6}><ReportItems items={report.priorities} numbered/></ReportSection>
      <ReportSection index={7}><p>{report.direction}</p></ReportSection>
      {report.memo && <section className="report-section"><h3>추가 메모</h3><p className="memo-text">{report.memo}</p></section>}
      <section className="support-section"><p className="eyebrow">WITH BESTABLE</p><h3>진단 결과에 따라 지원 가능한 운영 영역</h3><p>진단 결과 필요한 경우 아래 영역의 운영 지원이 가능합니다.</p><div className="service-list">{services.map(service => <div key={service.title}><h4>{service.title}</h4><p>{service.description}</p></div>)}</div></section>
    </div>
  </article>;
}

export default function App() {
  const [input, setInput] = useState(initialInput);
  const [report, setReport] = useState(null);
  const [generatedInput, setGeneratedInput] = useState('');
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState('');
  const [copyFallback, setCopyFallback] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const reportRef = useRef(null);
  const errorRef = useRef(null);
  const completed = Object.keys(input.ratings).length;
  const score = calculateScore(input.ratings);
  const changed = report && generatedInput !== JSON.stringify(input);
  const update = (key, value) => { setInput(previous => ({ ...previous, [key]: value })); setMessage(''); };
  const updateKeyword = (index, key, value) => update('keywords', input.keywords.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row));
  const toggleTag = (key, label) => update(key, input[key].includes(label) ? input[key].filter(item => item !== label) : [...input[key], label]);

  function handleGenerate(event) {
    event.preventDefault();
    const issues = [];
    if (!input.business.trim()) issues.push('업체명을 입력해 주세요.');
    if (!input.industry) issues.push('업종을 선택해 주세요.');
    if (!input.region.trim()) issues.push('지역을 입력해 주세요.');
    if (input.url.trim()) {
      try { const url = new URL(input.url.trim()); if (!['http:', 'https:'].includes(url.protocol)) throw new Error(); }
      catch { issues.push('플레이스 URL은 https:// 또는 http://로 시작하는 전체 주소를 입력해 주세요.'); }
    }
    input.keywords.forEach((row, index) => {
      if (!row.keyword.trim() && (row.rank !== '' || row.unknown)) issues.push(`${index + 1}번째 키워드 이름도 입력해 주세요.`);
      if (row.keyword.trim() && !row.unknown && (!/^\d+$/.test(row.rank) || !Number.isSafeInteger(Number(row.rank)) || Number(row.rank) < 1)) issues.push(`${index + 1}번째 키워드에 1 이상의 정수 순위를 입력하거나 ‘순위 확인 안 됨’을 선택해 주세요.`);
    });
    const missing = areas.filter(area => !input.ratings[area.id]);
    if (missing.length) issues.push(`다음 진단 영역을 선택해 주세요: ${missing.map(area => area.name).join(', ')}`);
    setErrors(issues);
    if (issues.length) { setTimeout(() => errorRef.current?.focus(), 0); return; }
    setReport(generateReport(input));
    setGeneratedInput(JSON.stringify(input));
    setCopyFallback(false);
    setMessage('리포트가 생성되었습니다. 내용을 확인한 뒤 복사하거나 인쇄할 수 있습니다.');
    setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }

  async function handleCopy() {
    try { await navigator.clipboard.writeText(reportToText(report)); setCopyFallback(false); setMessage('리포트 전체를 복사했습니다. 원하는 곳에 붙여넣기 하세요.'); }
    catch { setCopyFallback(true); setMessage('브라우저에서 자동 복사를 허용하지 않았습니다. 아래 복사용 글을 선택한 뒤 Ctrl+C를 누르세요. 모바일은 길게 눌러 복사할 수 있습니다.'); }
  }

  function reset() {
    setInput(initialInput()); setReport(null); setGeneratedInput(''); setErrors([]); setCopyFallback(false); setResetOpen(false); setMessage('입력 내용과 리포트를 초기화했습니다.');
  }

  return <>
    <header className="app-header"><div className="header-inner"><a href="#" className="wordmark" aria-label="베스트에이블 홈">BESTABLE<span className="logo-dot">.</span></a><span className="header-divider"/><span className="header-name">플레이스 진단</span><span className="internal-badge">내부 상담 도구</span></div></header>
    <main>
      <div className="page-intro"><div><p className="eyebrow">BESTABLE PLACE CONSULTING</p><h1>플레이스 진단 리포트 생성기</h1><p>직접 확인한 정보를, 고객을 위한 명확한 운영 방향으로.</p></div><div className="local-note"><span className="local-dot"/>직접 입력 · 브라우저 내 처리<span>자동 수집 없이 작성합니다</span></div></div>
      <div className="workspace">
        <div className="input-column">
          <div className="panel-title"><h2>진단 정보 입력</h2><span>약 3~5분 소요</span></div>
          <form onSubmit={handleGenerate} noValidate>
            <div className="input-card">
              <SectionHeading number="01" title="업체 기본정보">진단할 업체를 알려주세요. <span className="required">*</span> 필수 입력</SectionHeading>
              <div className="field"><label htmlFor="business">업체명 <span className="required">*</span></label><input id="business" value={input.business} onChange={event => update('business', event.target.value)} placeholder="예: 베스트 곱창 신림점" required maxLength={120}/></div>
              <div className="field-row"><div className="field"><label htmlFor="industry">업종 <span className="required">*</span></label><select id="industry" value={input.industry} onChange={event => update('industry', event.target.value)} required><option value="">업종 선택</option>{Object.keys(industryTemplates).map(industry => <option key={industry}>{industry}</option>)}</select></div><div className="field"><label htmlFor="region">지역 <span className="required">*</span></label><input id="region" value={input.region} onChange={event => update('region', event.target.value)} placeholder="예: 서울 관악구 신림동" required maxLength={120}/></div></div>
              <div className="field"><label htmlFor="url">네이버 플레이스 URL <span className="optional">선택</span></label><input id="url" type="url" value={input.url} onChange={event => update('url', event.target.value)} placeholder="https://..." maxLength={2000}/><small>참고 주소로만 표시하며, 주소에서 정보를 가져오지 않습니다.</small></div>
            </div>
            <div className="input-card"><SectionHeading number="02" title="목표 검색 키워드">직접 확인한 순위를 입력하세요. 최대 5개까지 가능합니다.</SectionHeading>
              <div className="keyword-list">{input.keywords.map((row, index) => <div className="keyword-row" key={index}><span className="keyword-index">{String(index + 1).padStart(2, '0')}</span><div className="keyword-fields"><div className="keyword-top"><input aria-label={`${index + 1}번째 키워드`} value={row.keyword} onChange={event => updateKeyword(index, 'keyword', event.target.value)} placeholder="예: 신림 곱창" maxLength={100}/><div className="rank-input"><input type="number" inputMode="numeric" min="1" step="1" aria-label={`${index + 1}번째 현재 순위`} value={row.rank} disabled={row.unknown} onChange={event => updateKeyword(index, 'rank', event.target.value)} placeholder="순위"/><span>위</span></div></div><label className="checkbox-label"><input type="checkbox" checked={row.unknown} onChange={event => updateKeyword(index, 'unknown', event.target.checked)}/>순위 확인 안 됨</label></div>{input.keywords.length > 3 && <button className="remove-keyword" type="button" aria-label={`${index + 1}번째 키워드 삭제`} onClick={() => update('keywords', input.keywords.filter((_, rowIndex) => rowIndex !== index))}>×</button>}</div>)}</div>
              <button type="button" className="add-button" onClick={() => update('keywords', [...input.keywords, emptyKeyword()])} disabled={input.keywords.length >= 5}>+ 키워드 추가 <span>{input.keywords.length}/5</span></button><p className="field-help">키워드를 아직 확인하지 않았다면 모두 비워 두어도 됩니다.</p>
            </div>
            <div className="input-card"><SectionHeading number="03" title="플레이스 핵심 진단">6개 영역을 직접 확인한 상태에 맞게 선택해 주세요.</SectionHeading><div className="completion"><span>진단 선택 <strong>{completed}/6</strong></span><span>{score === null ? '모두 선택하면 점수가 계산됩니다' : `현재 점수 ${score} / 100점`}</span></div><div className="progress-track"><div style={{ width: `${completed / 6 * 100}%` }}/></div>
              <div className="assessment-list">{areas.map(area => <fieldset className="assessment" key={area.id}><legend>{area.name} <small>{area.weight}점</small></legend><p>{area.description}</p><div className="rating-options">{Object.entries(levels).map(([key, value]) => <label className={`rating-option ${input.ratings[area.id] === key ? `selected ${key}` : ''}`} key={key}><input type="radio" name={area.id} value={key} checked={input.ratings[area.id] === key} onChange={() => update('ratings', { ...input.ratings, [area.id]: key })}/><span>{input.ratings[area.id] === key && '✓ '}{value.label}</span></label>)}</div><details><summary>판단 참고 요소</summary><p>{area.hints}</p></details></fieldset>)}</div>
              <p className="field-help">좋음 100% · 보통 60% · 미흡 25%의 배점 적용</p>
            </div>
            <div className="input-card"><SectionHeading number="04" title="강점과 개선 포인트">해당하는 항목을 여러 개 선택할 수 있습니다.</SectionHeading><div className="tag-section"><div className="tag-title"><h3>현재 잘하고 있는 점</h3><span>{input.strengths.length}개 선택</span></div><div className="tag-list">{strengths.map(tag => <button key={tag.label} type="button" aria-pressed={input.strengths.includes(tag.label)} className={`tag strength ${input.strengths.includes(tag.label) ? 'active' : ''}`} onClick={() => toggleTag('strengths', tag.label)}>{input.strengths.includes(tag.label) ? '✓ ' : '+ '}{tag.label}</button>)}</div></div><div className="tag-section"><div className="tag-title"><h3>보완이 필요한 점</h3><span>{input.problems.length}개 선택</span></div>{problemGroups.map(group => <div className="problem-group" key={group.name}><h4>{group.name}</h4><div className="tag-list">{group.tags.map(tag => <button key={tag.label} type="button" aria-pressed={input.problems.includes(tag.label)} className={`tag problem ${input.problems.includes(tag.label) ? 'active' : ''}`} onClick={() => toggleTag('problems', tag.label)}>{input.problems.includes(tag.label) ? '✓ ' : '+ '}{tag.label}</button>)}</div></div>)}</div></div>
            <div className="input-card"><SectionHeading number="05" title="추가 메모">특이사항이나 고객에게 별도로 전달하고 싶은 내용이 있을 경우 입력하세요.</SectionHeading><label className="sr-only" htmlFor="memo">추가 메모</label><textarea id="memo" rows="4" value={input.memo} onChange={event => update('memo', event.target.value)} placeholder="선택 입력 · 입력한 메모는 고객용 리포트에도 표시됩니다." maxLength={5000}/><p className="field-help">작성하지 않아도 리포트를 생성할 수 있습니다.</p></div>
            {errors.length > 0 && <div className="error-box" role="alert" tabIndex="-1" ref={errorRef}><strong>아래 내용을 확인해 주세요.</strong><ul>{errors.map(error => <li key={error}>{error}</li>)}</ul></div>}
            <div className="form-actions"><button type="submit" className="primary-button">리포트 생성하기 <span>↗</span></button><button type="button" className="text-button" onClick={() => setResetOpen(true)}>입력 내용 초기화</button><p>입력 정보는 저장되지 않습니다. 창을 닫거나 새로고침하면 사라집니다.</p></div>
          </form>
        </div>
        <div className="report-column" ref={reportRef}><div className="panel-title report-toolbar"><div><h2>진단 리포트</h2><span className={`preview-badge ${report ? 'ready' : ''}`}>{report ? '생성 완료' : '미리보기'}</span></div><div className="toolbar-buttons"><button type="button" className="secondary-button" disabled={!report} onClick={handleCopy}>리포트 전체 복사</button><button type="button" className="secondary-button" disabled={!report} onClick={() => window.print()}>인쇄 / PDF</button></div></div>
          {changed && <div className="stale-notice" role="status">입력 내용이 변경되었습니다. <strong>리포트 생성하기</strong>를 다시 눌러 반영해 주세요.</div>}
          <div className="message" role="status" aria-live="polite">{message}</div>
          {copyFallback && <div className="copy-fallback"><label htmlFor="copy-text">전체 리포트 복사용 글</label><textarea id="copy-text" readOnly value={reportToText(report)} onFocus={event => event.target.select()} rows="8"/><button type="button" className="secondary-button" onClick={() => { const element = document.getElementById('copy-text'); element.focus(); element.select(); }}>전체 선택</button></div>}
          {report ? <Report report={report}/> : <div className="empty-report"><div className="empty-art" aria-hidden="true"><div className="mini-report"><span className="mini-logo">B.</span><i/><i/><div><b/><b/><b/></div><i/><i/></div><span className="art-check">✓</span></div><p className="eyebrow">FROM INSIGHT TO ACTION</p><h2>좋은 진단이,<br/>더 나은 운영의 시작입니다.</h2><p>업체 정보를 입력하고 진단 항목을 선택한 뒤<br className="desktop-break"/> 리포트를 생성해 주세요.</p><div className="empty-features"><span>01 <strong>검색 노출 현황</strong></span><span>02 <strong>강점과 개선 기회</strong></span><span>03 <strong>우선 실행 과제</strong></span></div><p className="empty-footnote">직접 확인한 정보로 작성하는 맞춤 진단 리포트</p></div>}
        </div>
      </div>
      <footer className="app-footer">BESTABLE <span>더 나은 연결을 만드는 마케팅 파트너</span></footer>
    </main>
    {resetOpen && <div className="modal-backdrop"><div className="reset-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title" onKeyDown={event => { if (event.key === 'Escape') setResetOpen(false); if (event.key === 'Tab') { event.preventDefault(); const buttons = event.currentTarget.querySelectorAll('button'); (document.activeElement === buttons[0] ? buttons[1] : buttons[0]).focus(); } }}><h2 id="reset-title">입력 내용을 초기화할까요?</h2><p>작성한 정보와 생성한 리포트가 지워집니다. 필요한 리포트는 먼저 복사해 주세요.</p><div><button type="button" className="secondary-button" autoFocus onClick={() => setResetOpen(false)}>돌아가기</button><button type="button" className="primary-button" onClick={reset}>모두 초기화</button></div></div></div>}
  </>;
}
