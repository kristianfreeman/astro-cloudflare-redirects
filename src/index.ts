import type { AstroIntegration } from "astro"
import fs from "fs/promises"
import { cloudflareRedirect } from "vite-plugin-cloudflare-redirect"

type RedirectsConfig = {
  redirectsFile?: string
}

export default function astroCloudflareRedirects(options?: RedirectsConfig): AstroIntegration {
  return {
    name: "Cloudflare Redirects",
    hooks: {
      'astro:config:setup': async ({ logger, updateConfig }) => {
        let file = options?.redirectsFile || "public/_redirects"

        try {
          await fs.stat(file)

          updateConfig({
            vite: {
              plugins: [
                cloudflareRedirect({
                  redirectsFile: file
                })
              ]
            }
          })

          logger.info(`Setting up redirects from ${file}`)
        } catch (e) {
          logger.warn(`Redirects file not found: ${file}. Skipping _redirects integration`)
        }
      }
    }
  }
}