// wallet.js – BTC + USDT display + split save stub
import { supabase } from './supabase.js';
import { splitRevenue } from './splitprocessor.js';

const BTC_ADDRESS = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'; // your BTC
const USDT_ADDRESS = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb'; // your USDT TRC20

export async function initWallet() {
  if (accountType !== 'creator') {
    console.log('Wallet only for creators');
    return;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', supabase.auth.user()?.id)
    .single();

  let balance = data?.balance || 0;

  // Example: simulate adding split from CPM
  const exampleImpression = 0.50;
  const payout = splitRevenue(exampleImpression, 'cpm', 'creator', false);
  balance += payout.creator; // add creator's share to balance

  const walletUI = document.createElement('div');
  walletUI.innerHTML = `
    <h3>Your Wallet</h3>
    <p>BTC: ${BTC_ADDRESS}</p>
    <p>USDT (TRC20): ${USDT_ADDRESS}</p>
    <p>Balance: ${balance.toFixed(8)} (pending)</p>
    <button onclick="copyBTC()">Copy BTC</button>
    <button onclick="copyUSDT()">Copy USDT</button>
  `;

  document.getElementById('profile')?.appendChild(walletUI);
}

function copyBTC() { navigator.clipboard.writeText('${BTC_ADDRESS}').then(() => alert('Copied!')); }
function copyUSDT() { navigator.clipboard.writeText('${USDT_ADDRESS}').then(() => alert('Copied!')); }
