#!/usr/bin/env node

// Simple CLI tool to check logged in users
const http = require('http');

const API_BASE = 'http://localhost:5001/api/users';

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5001,
            path: `/api/users${path}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

async function showStats() {
    try {
        const stats = await makeRequest('/stats');
        if (stats.success) {
            console.log('\n📊 USER STATISTICS');
            console.log('==================');
            console.log(`👥 Total Users: ${stats.data.totalUsers}`);
            console.log(`🟢 Online Now: ${stats.data.onlineUsers}`);
            console.log(`🔴 Offline: ${stats.data.offlineUsers}`);
            console.log(`📅 Active Today: ${stats.data.todayActiveUsers}`);
            console.log(`✨ New Today: ${stats.data.newUsersToday}`);
            console.log(`🕐 Last Updated: ${new Date(stats.data.lastUpdated).toLocaleString()}`);
        } else {
            console.log('❌ Error:', stats.message);
        }
    } catch (error) {
        console.log('❌ Connection Error:', error.message);
    }
}

async function showOnlineUsers() {
    try {
        const users = await makeRequest('/online');
        if (users.success && users.data.length > 0) {
            console.log('\n🟢 ONLINE USERS');
            console.log('================');
            users.data.forEach((user, index) => {
                const lastActive = new Date(user.lastActive).toLocaleString();
                console.log(`${index + 1}. 👤 ${user.name}`);
                console.log(`   📧 ${user.email}`);
                console.log(`   🕐 Last Active: ${lastActive}`);
                console.log('');
            });
        } else if (users.success) {
            console.log('\n🟢 ONLINE USERS');
            console.log('================');
            console.log('No users currently online.');
        } else {
            console.log('❌ Error:', users.message);
        }
    } catch (error) {
        console.log('❌ Connection Error:', error.message);
    }
}

async function showRecentActivity() {
    try {
        const activity = await makeRequest('/activity?days=1');
        if (activity.success && activity.data.length > 0) {
            console.log('\n📊 RECENT ACTIVITY (24 hours)');
            console.log('==============================');
            activity.data.forEach((user, index) => {
                const lastActive = new Date(user.lastActive).toLocaleString();
                const status = user.isActive ? '🟢 Online' : '🔴 Offline';
                console.log(`${index + 1}. 👤 ${user.name} ${status}`);
                console.log(`   📧 ${user.email}`);
                console.log(`   🕐 Last Active: ${lastActive}`);
                console.log('');
            });
        } else if (activity.success) {
            console.log('\n📊 RECENT ACTIVITY (24 hours)');
            console.log('==============================');
            console.log('No recent activity found.');
        } else {
            console.log('❌ Error:', activity.message);
        }
    } catch (error) {
        console.log('❌ Connection Error:', error.message);
    }
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'stats';

    console.log('💕 DilseMatchify User Monitor');
    console.log('=============================');

    switch (command.toLowerCase()) {
        case 'stats':
        case 's':
            await showStats();
            break;
        case 'online':
        case 'o':
            await showOnlineUsers();
            break;
        case 'activity':
        case 'a':
            await showRecentActivity();
            break;
        case 'all':
            await showStats();
            await showOnlineUsers();
            await showRecentActivity();
            break;
        case 'help':
        case 'h':
            console.log('\nAvailable commands:');
            console.log('  stats, s      - Show user statistics');
            console.log('  online, o     - Show online users');
            console.log('  activity, a   - Show recent activity');
            console.log('  all           - Show everything');
            console.log('  help, h       - Show this help');
            console.log('\nUsage: node check-users.js [command]');
            break;
        default:
            console.log(`❌ Unknown command: ${command}`);
            console.log('Use "help" to see available commands.');
    }

    console.log('\n✅ Done!');
}

// Run the script
main().catch(console.error);
