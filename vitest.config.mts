import swc from 'unplugin-swc';
import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        root: './',
        include: ['**/*.spec.ts'],
        coverage: {
            enabled: true,
            provider: 'v8',
            exclude: [
                ...configDefaults.coverage.exclude,
                "src/main.ts",
                "src/app.module.ts",
                "prisma",
                "src/auth/guards",
            ],
        }
    },
    plugins: [
        swc.vite({
            module: { type: 'es6' },
        }),
    ],
});
