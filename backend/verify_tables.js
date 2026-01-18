
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function check() {
    console.log("Checking ORDERS table...");
    const { error } = await supabase.from('orders').select('id').limit(1);
    
    if (error) {
        console.log("RESULT: MISSING / ERROR");
        console.log("CODE:", error.code);
        console.log("MSG:", error.message);
    } else {
        console.log("RESULT: EXISTS");
    }
}

check();
