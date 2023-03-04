import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { viteSingleFile } from 'vite-plugin-singlefile'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
	plugins: [
		react({
			jsxImportSource: '@emotion/react',
			babel: {
				plugins: ['@emotion/babel-plugin'],
			},
		}),
		viteSingleFile(),
		mkcert(),
	],
	server: {
		https: true,
	},
	base: '',
	resolve: {
		alias: {
			src: fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
})
