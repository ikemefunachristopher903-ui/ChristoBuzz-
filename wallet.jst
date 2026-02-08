// wallet.js – BTC + USDT (TRC20) display for creators
import { supabase } from './supabase.js';

const BTC_ADDRESS = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'; // your BTC
const USDT_ADDRESS = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb'; // your USDT TRC20

export async function initWallet() {
  if (accountType !== 'creator') {
    console.log('Wallet only for creators');
    return;
  }

  const { data } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', supabase.auth.user()?.id)
    .single();

  const balance = data?.balance || 0;

  const walletUI = document.createElement('div');
  walletUI.innerHTML = `
    <h3>Your Wallet</h3>
    <p>BTC: ${BTC_ADDRESS}</p>
    <p>USDT (TRC20): ${USDT_ADDRESS}</p>
    <p>Balance: ${balance.toFixed(8)}</p>
  `;
  document.getElementById('profile')?.appendChild(walletUI);
}
