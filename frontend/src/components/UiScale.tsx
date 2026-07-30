/**
 * 데스크톱 화면 확대 배율.
 *
 * <p>프론트엔드 디자인은 1080p 데스크톱을 기준으로 다시 잡았고, 그 배율을 root font-size
 * 로 준다(globals.css 의 치수는 전부 rem 이라 함께 커진다). 다만 root font-size 를 바꾸면
 * Tailwind 의 rem 기반 브레이크포인트까지 같이 밀려서(lg 64rem = 1024px → 1376px)
 * 화면이 좁으면 표와 그리드가 무너진다. 그래서 맥북 논리 해상도(16" 1728px 가 최대)까지는
 * 변경 전 16px 기준을 그대로 두고, 그보다 넓은 데스크톱에서만 확대한다.
 *
 * <p>랜딩과 대시보드에만 붙인다. 로그인·회원가입은 확대를 전제로 만들어지지 않아
 * 통계 숫자가 잘려서(17,000+ → 554+) 다른 값으로 보이므로 제외한다.
 */
const MIN_WIDTH_PX = 1800;

export function UiScale() {
	return (
		<style
			dangerouslySetInnerHTML={{
				__html: `@media (min-width:${MIN_WIDTH_PX}px){html{font-size:21.5px}}`,
			}}
		/>
	);
}
