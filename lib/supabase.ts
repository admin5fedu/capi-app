import { createClient } from '@supabase/supabase-js';

// Vì không còn môi trường build, chúng ta sẽ luôn sử dụng các giá trị này.
const supabaseUrl = "https://mvecvfzxmawtndkhmnpw.supabase.co"; 
const supabaseKey = "sb_publishable_zdD3gDpf_EfteD3Ip3FOfQ_ke3iPmHK";

if (!supabaseUrl || !supabaseKey) {
  const errorMessage = "Chưa cấu hình Supabase URL và Key. Vui lòng kiểm tra file lib/supabase.ts.";
  
  // Hiển thị lỗi trên màn hình thay vì chỉ crash trong console
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding: 2rem; text-align: center; color: red;"><h1>Lỗi Cấu Hình</h1><p>${errorMessage}</p></div>`;
  }
  throw new Error(errorMessage);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
