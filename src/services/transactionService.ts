import { supabase } from '../config/supabase';

export interface TransactionData {
  amount: number;
  provider?: string; // For top_up and withdrawal
  recipientPaymentCode?: string; // For send transactions
}

export const transactionService = {
  async getWallet() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return { wallet: data, error: null };
    } catch (error: any) {
      console.error('Get wallet error:', error);
      return { wallet: null, error: error.message || 'Failed to get wallet' };
    }
  },

  async topUp(data: TransactionData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create transaction
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'top_up',
          amount: data.amount,
          payment_provider: data.provider,
          status: 'processing',
          description: `Top-up via ${data.provider}`,
        })
        .select('id, transaction_id, amount, status, transaction_type, payment_provider, created_at')
        .single();

      if (error) throw error;

      // Simulate processing delay, then complete
      setTimeout(async () => {
        await supabase
          .from('transactions')
          .update({ status: 'completed' })
          .eq('id', transaction.id);
      }, 2000);

      return { transaction, error: null };
    } catch (error: any) {
      console.error('Top-up error:', error);
      return { transaction: null, error: error.message || 'Failed to top up' };
    }
  },

  async withdraw(data: TransactionData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check balance
      const { wallet } = await this.getWallet();
      if (!wallet || wallet.balance < data.amount) {
        throw new Error('Insufficient balance');
      }

      // Create transaction
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'withdrawal',
          amount: data.amount,
          payment_provider: data.provider,
          status: 'processing',
          description: `Withdrawal via ${data.provider}`,
        })
        .select('id, transaction_id, amount, status, transaction_type, payment_provider, created_at')
        .single();

      if (error) throw error;

      // Simulate processing delay, then complete
      setTimeout(async () => {
        await supabase
          .from('transactions')
          .update({ status: 'completed' })
          .eq('id', transaction.id);
      }, 2000);

      return { transaction, error: null };
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      return { transaction: null, error: error.message || 'Failed to withdraw' };
    }
  },

  async send(data: TransactionData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (!data.recipientPaymentCode) {
        throw new Error('Recipient payment code is required');
      }

      // Get recipient user
      const { data: recipientData, error: recipientError } = await supabase
        .rpc('get_user_by_payment_code', { p_code: data.recipientPaymentCode });

      if (recipientError || !recipientData || recipientData.length === 0) {
        throw new Error('Recipient not found');
      }

      const recipient = recipientData[0];

      // Check balance
      const { wallet } = await this.getWallet();
      if (!wallet || wallet.balance < data.amount) {
        throw new Error('Insufficient balance');
      }

      // Create send transaction for sender
      const { data: sendTransaction, error: sendError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'send',
          amount: data.amount,
          recipient_user_id: recipient.id,
          recipient_payment_code: data.recipientPaymentCode,
          status: 'processing',
          description: `Send to ${recipient.full_name}`,
        })
        .select('id, transaction_id, amount, status, transaction_type, recipient_user_id, recipient_payment_code, created_at')
        .single();

      if (sendError) throw sendError;

      // The database trigger (update_wallet_balance) will automatically:
      // 1. Create receive transaction for recipient when send transaction status changes to 'completed'
      // 2. Update sender's wallet (deduct amount)
      // 3. Update recipient's wallet (add amount)
      // So we just need to complete the send transaction

      // Simulate processing delay, then complete the transaction
      // The trigger will handle creating receive transaction and updating both wallets
      // The recipient's HomeScreen will catch the receive transaction via real-time subscription
      // and show the notification/alert
      setTimeout(async () => {
        await supabase
          .from('transactions')
          .update({ status: 'completed' })
          .eq('id', sendTransaction.id);
      }, 2000);

      return { transaction: sendTransaction, error: null };
    } catch (error: any) {
      console.error('Send error:', error);
      return { transaction: null, error: error.message || 'Failed to send' };
    }
  },

  async getUserByPaymentCode(paymentCode: string) {
    try {
      const { data, error } = await supabase
        .rpc('get_user_by_payment_code', { p_code: paymentCode });

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('User not found');
      }
      return { user: data[0], error: null };
    } catch (error: any) {
      console.error('Get user by payment code error:', error);
      return { user: null, error: error.message || 'Failed to get user' };
    }
  },

  async getTransactions(limit = 50) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`user_id.eq.${user.id},recipient_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { transactions: data, error: null };
    } catch (error: any) {
      console.error('Get transactions error:', error);
      return { transactions: null, error: error.message || 'Failed to get transactions' };
    }
  },

  async getUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, phone_number, physical_address, gender, city_town, payment_code, created_at, updated_at')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      // Ensure payment_code exists (should be generated by trigger, but check anyway)
      if (!data.payment_code) {
        // Generate a new payment code if somehow missing
        const newPaymentCode = 'TSAMAYA_' + Math.random().toString(36).substring(2, 14).toUpperCase();
        const { error: updateError } = await supabase
          .from('users')
          .update({ payment_code: newPaymentCode })
          .eq('id', user.id);
        
        if (!updateError) {
          data.payment_code = newPaymentCode;
        }
      }
      
      return { profile: data, error: null };
    } catch (error: any) {
      console.error('Get user profile error:', error);
      return { profile: null, error: error.message || 'Failed to get profile' };
    }
  },
};

