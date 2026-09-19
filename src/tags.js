export const strengths = [
  { label: '리뷰 많음', area: 'reviews', detail: '축적된 리뷰는 고객이 실제 이용 경험을 살펴볼 수 있는 자료입니다. 후기에서 자주 언급되는 장점을 소개글과 콘텐츠에 연결해 활용할 수 있습니다.' },
  { label: '최근 리뷰 활발', area: 'reviews', detail: '최근 이용 경험을 담은 리뷰가 이어지고 있다는 점이 강점입니다. 최근 후기의 질문과 반응을 확인하면 고객에게 필요한 정보를 더 정확하게 안내할 수 있습니다.' },
  { label: '사진 콘텐츠 좋음', area: 'content', detail: '사진 콘텐츠는 고객이 방문 전 업체의 모습을 이해하는 데 도움을 줍니다. 대표사진과 상세 사진의 역할을 나누어 유지하면 비교 과정에서 정보를 쉽게 전달할 수 있습니다.' },
  { label: '기본정보 충실', area: 'search', detail: '기본정보가 충실하게 정리되어 고객이 업체를 이해할 수 있는 토대가 마련되어 있습니다. 영업시간과 서비스 변경 사항을 꾸준히 반영해 정보의 정확성을 유지하는 것이 좋습니다.' },
  { label: '상위 노출 키워드 있음', area: 'search', detail: '직접 확인한 상위 노출 키워드는 현재 검색 접점을 파악하는 데 유용한 자산입니다. 같은 조건에서 순위를 기록하고 해당 검색 의도에 맞는 정보를 보강하는 방향이 적합합니다.' },
  { label: '브랜드 인지도 있음', area: 'external', detail: '브랜드 인지도는 고객이 업체를 다시 찾거나 추가 정보를 확인하는 출발점이 될 수 있습니다. 브랜드명으로 확인할 수 있는 정보와 각 채널의 안내를 일관되게 유지하는 것이 좋습니다.' },
  { label: '블로그 콘텐츠 풍부', area: 'external', detail: '블로그 콘텐츠는 플레이스에서 담기 어려운 상세 정보를 설명할 수 있는 자료입니다. 기존 글 중 현재도 유효한 내용을 정리해 비교 검토에 필요한 정보를 쉽게 찾도록 안내할 수 있습니다.' },
  { label: '예약·문의 동선 좋음', area: 'conversion', detail: '예약과 문의 경로가 잘 정리되어 고객이 다음 행동을 선택하기 수월한 상태입니다. 실제 연결 상태와 응대 안내를 정기적으로 확인해 이러한 강점을 유지하는 것이 좋습니다.' },
  { label: '업체 차별점 명확', area: 'content', detail: '업체만의 특징이 명확해 고객이 선택 이유를 이해하는 데 도움이 됩니다. 사진과 소개글, 서비스 설명에서 같은 특징을 구체적인 사례로 전달하면 좋습니다.' },
  { label: '최근 플레이스 관리 활발', area: 'activity', detail: '최근에도 관리가 이루어지고 있어 고객에게 현재 운영 정보를 전달할 수 있습니다. 일정한 업데이트 주기를 유지하면서 반복되는 문의를 콘텐츠에 반영하면 좋습니다.' },
];

export const problemGroups = [
  { name: '기본 / 검색', tags: [{ label: '기본정보 미흡', area: 'search' }, { label: '소개글 부족', area: 'search' }, { label: '키워드 약함', area: 'search' }, { label: '업체 차별점 부족', area: 'search' }] },
  { name: '사진 / 콘텐츠', tags: [{ label: '대표사진 약함', area: 'content' }, { label: '사진 부족', area: 'content' }, { label: '사진 오래됨', area: 'content' }, { label: '소식 없음', area: 'activity' }, { label: '홍보 콘텐츠 부족', area: 'content' }] },
  { name: '리뷰', tags: [{ label: '리뷰 부족', area: 'reviews' }, { label: '최근 리뷰 부족', area: 'reviews' }, { label: '리뷰 답글 부족', area: 'reviews' }, { label: '블로그 리뷰 부족', area: 'reviews' }, { label: '리뷰 강점 활용 부족', area: 'reviews' }] },
  { name: '외부 콘텐츠', tags: [{ label: '브랜드블로그 없음', area: 'external' }, { label: '블로그 노출 약함', area: 'external' }, { label: '콘텐츠 업데이트 부족', area: 'activity' }, { label: '네이버클립 없음', area: 'external' }, { label: '인스타그램 운영 부족', area: 'external' }] },
  { name: '전환', tags: [{ label: '예약 기능 부족', area: 'conversion' }, { label: '문의 동선 약함', area: 'conversion' }, { label: '이벤트 또는 쿠폰 없음', area: 'conversion' }, { label: '가격 정보 부족', area: 'conversion' }, { label: '방문정보 부족', area: 'conversion' }] },
];
export const problems = problemGroups.flatMap(group => group.tags);
