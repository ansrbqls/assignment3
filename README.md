# Open Survey

Open Survey는 사용자가 자신이 만든 설문 링크를 웹사이트에 등록하고, 다양한 사람들과 공유하며 응답을 받을 수 있는 설문 공유 플랫폼입니다.

## 주요 기능

- 설문 링크 등록 및 공유
- 카테고리별 설문 분류
- 인기순/최신순 정렬
- 회원가입/로그인
- 마이페이지 (등록한 설문, 응답한 설문 관리)

## 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS
- MongoDB (예정)
- NextAuth.js (예정)

## 시작하기

1. 저장소 클론
```bash
git clone [repository-url]
cd open-survey
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 브라우저에서 확인
```
http://localhost:3000
```

## 프로젝트 구조

```
src/
  ├── app/              # Next.js 13+ App Router
  ├── components/       # 재사용 가능한 컴포넌트
  ├── lib/             # 유틸리티 함수
  └── models/          # 데이터 모델
```

## 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 라이선스

MIT License 