import type { AstroIntegration } from "astro"
import fs from "fs/promises"
import { cloudflareRedirect } from "vite-plugin-cloudflare-redirect"

export default function astroCloudflareRedirects({
  redirectsFile
}: {
  redirectsFile?: string
}): AstroIntegration {
  return {
    name: "Cloudflare Redirects",
    hooks: {
      'astro:config:setup': async ({ logger, updateConfig }) => {
        let file = redirectsFile || "public/_redirects"
        let config = redirectsFile ? { redirectsFile: file } : {}

        try {
          await fs.stat(file)

          updateConfig({
            vite: {
              plugins: [
                cloudflareRedirect(config)
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
