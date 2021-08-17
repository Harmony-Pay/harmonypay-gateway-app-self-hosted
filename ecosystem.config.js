module.exports = {
    apps: [
        {
            name: 'harmonypay-gateway-app',
            script: './harmonypay-gateway-app/node_modules/next/dist/bin/next',
            args: 'dev -H 0.0.0.0 -p 3033',
            cwd: './harmonypay-gateway-app',
        },
        {
            name: 'autosettlement-agent',
            script: './autosettlement-agent/index.js',
            watch: ["."],
            // Delay between restart
            watch_delay: 10000,
            ignore_watch: [".git", "payments-monitor", "harmonypay-gateway-app", "autosettlement-agent", "package.json", "package-lock.json"],
        },
        {
            name: 'payments-monitor',
            script: './payments-monitor/index.js',
            watch: ["."],
            // Delay between restart
            watch_delay: 10000,
            ignore_watch: [".git", "payments-monitor", "harmonypay-gateway-app", "autosettlement-agent", "package.json", "package-lock.json"],
        }
    ]
};
