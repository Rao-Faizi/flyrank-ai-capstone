This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Animation Details

The chat interface uses Framer Motion to provide a smooth, natural feel. 
- **Easing:** A custom `easeOut` curve (`[0.25, 0.1, 0.25, 1]`) is used to make new messages slide in quickly but settle gently, mimicking natural conversation pacing.
- **Duration:** New message appearances use a snappy `0.3s` duration to maintain responsiveness without feeling rushed, while layout changes (like auto-scrolling) use a slightly longer `0.4s` spring animation to prevent jarring visual jumps.

## 3D Real Estate Viewer - Performance Budget
The Interactive 3D Real Estate Viewer (`/3d-viewer`) is heavily optimized to ensure minimal impact on the lead qualification flow:
- **Zero Asset-Download Latency:** We avoided downloading external `.glb` models entirely. The building is constructed procedurally using native `three.js` Box and Plane geometries, resulting in virtually 0 bytes of model payload.
- **Lazy Loading:** The entire 3D chunk (`@react-three/fiber`, `three`, and physics engines) is dynamically imported via `next/dynamic` with `ssr: false`. It does not bloat the initial page load or block server-side rendering.
- **Draw Call Optimizations:** The geometries are kept simple and modular. Future enhancements could merge the floor geometries using `InstancedMesh` if the building scales to hundreds of floors.
- **A11y:** Animations and auto-rotations respect `prefers-reduced-motion: reduce`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
