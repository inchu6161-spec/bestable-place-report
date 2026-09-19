export const areas = [
  { id: 'search', name: '검색 노출 기반', weight: 20, description: '플레이스 기본 세팅과 핵심 키워드 연결 상태', hints: '업체 기본정보 · 카테고리 · 소개글 · 주요 서비스 · 지역 + 업종 키워드 · 핵심 키워드 연결' },
  { id: 'content', name: '첫인상·콘텐츠', weight: 15, description: '고객이 플레이스를 처음 봤을 때의 정보와 콘텐츠 구성', hints: '대표사진 · 최근 사진 · 사진 구성 · 메뉴 또는 서비스 정보 · 가격 정보 · 소식 · 홍보 콘텐츠' },
  { id: 'reviews', name: '리뷰 경쟁력', weight: 20, description: '고객의 선택에 영향을 주는 리뷰와 후기 상태', hints: '방문자 리뷰 · 최근 리뷰 · 리뷰 내용 · 리뷰 답글 · 블로그 리뷰 · 후기에서 반복적으로 나타나는 강점' },
  { id: 'activity', name: '운영 활성도', weight: 15, description: '플레이스가 최근에도 꾸준하게 관리되고 있는지', hints: '최근 사진 업데이트 · 소식 업데이트 · 메뉴 정보 업데이트 · 리뷰 답글 · 이벤트 · 시즌 콘텐츠' },
  { id: 'external', name: '외부 콘텐츠', weight: 15, description: '플레이스를 본 고객이 추가로 확인할 수 있는 콘텐츠', hints: '네이버 블로그 · 브랜드 블로그 · 블로그 후기 · 네이버 클립 · 인스타그램 · 기타 검색 콘텐츠' },
  { id: 'conversion', name: '예약·문의 전환', weight: 15, description: '검색 고객을 실제 문의·예약·방문으로 연결하는 구조', hints: '전화 · 예약 · 톡톡 · 쿠폰 · 이벤트 · 가격 · 길찾기 · 방문 정보' },
];

export const levels = { good: { label: '좋음', status: '양호', ratio: 1 }, average: { label: '보통', status: '보완 필요', ratio: .6 }, poor: { label: '미흡', status: '개선 필요', ratio: .25 } };

export function calculateScore(ratings) {
  if (areas.some(area => !levels[ratings[area.id]])) return null;
  // 15점 × 25% = 3.75점 등 소수점 점수도 그대로 합산합니다.
  return Math.round(areas.reduce((sum, area) => sum + area.weight * levels[ratings[area.id]].ratio, 0) * 100) / 100;
}

export function rankStatus(rank) {
  if (rank === null || rank === undefined || rank === '') return '노출 확인 어려움';
  const value = Number(rank);
  if (!Number.isSafeInteger(value) || value < 1) return '노출 확인 어려움';
  if (value <= 10) return '상위 노출';
  if (value <= 20) return '비교적 양호';
  if (value <= 40) return '보완 필요';
  return '노출 약함';
}
