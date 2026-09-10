
const puppeteer = require('puppeteer');

async function redeemDiamond(playerId, pinCode) {
    console.log(`[START] เริ่มต้นกระบวนการเติมเงินสำหรับ UID: ${playerId}...`);

    // บน Cloud Codespaces ต้องรันแบบ headless: true เท่านั้น
    const browser = await puppeteer.launch({
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    try {
        console.log('[1/3] กำลังเปิดหน้าเว็บทดสอบ...');
        await page.goto('https://httpbin.org/forms/post', { waitUntil: 'networkidle2' });

        console.log('[2/3] กำลังกรอกข้อมูล UID และ PIN...');
        await page.waitForSelector('input[name="custname"]');
        await page.type('input[name="custname"]', playerId);

        await page.waitForSelector('textarea[name="comments"]');
        await page.type('textarea[name="comments"]', pinCode);

        console.log('[3/3] กำลังส่งข้อมูล...');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('button')
        ]);

        const pageContent = await page.content();
        await browser.close();

        if (pageContent.includes(playerId)) {
            console.log('✅ [SUCCESS] ทำรายการสำเร็จเรียบร้อย!');
            return { success: true, message: 'เติมเงินสำเร็จ' };
        } else {
            console.log('❌ [FAILED] ทำรายการไม่สำเร็จ');
            return { success: false };
        }

    } catch (error) {
        if (browser) await browser.close();
        console.error('⚠️ [ERROR]:', error.message);
        return { success: false, error: error.message };
    }
}

// ทดสอบเรียกใช้งาน
redeemDiamond('FF_9988776655', 'PIN-1234-5678-9012');
