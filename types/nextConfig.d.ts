declare module "next" {
  interface NextConfig {
    eslint?: { ignoreDuringBuilds?: boolean },
    images?: { domains?: string[]},
    typescript?: { ignoreBuildErrors?: boolean },
  }
}
