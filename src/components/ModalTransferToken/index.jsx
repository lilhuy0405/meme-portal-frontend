import React, { useState } from 'react';
import './style.scss';
import OtpInput from 'react-otp-input';
import { Button, Form, Modal, Skeleton } from 'antd';
import { useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import { toast } from 'react-hot-toast';

const ModalTransferToken = ({ senderId, receiver, visible, handleOk, handleCancel }) => {
  const {
    data = {},
    isLoading,
    error,
  } = useQuery(['memeServices.userDetail', senderId],
    ({ queryKey }) => memeServices.userDetail(queryKey[1]));
  const { data: sender = {} } = data;
  const [showVerify, setShowVerify] = useState(false);
  const [otp, setOtp] = useState('');
  const [transactionId, setTransactionId] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleChange = (otp) => setOtp(otp);
  const handleTransfer = () => {
    form.submit();
  };
  const handleCancelVerify = async () => {
    setShowVerify(false);
    handleCancel();
  };
  const handleVerifyTransaction = async () => {
    if (otp.length < 6) {
      toast.error('please enter otp');
      return;
    }
    if (transactionId === 0) {
      toast.error('transaction not found');
      return;
    }
    const verifyTxPromise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        await memeServices.verifyTransaction({
          txId: transactionId,
          verifyCode: otp,
        });
        setShowVerify(false);
        handleOk();
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        setLoading(false);
      }
    });

    await toast.promise(verifyTxPromise, {
      loading: 'processing...',
      error: err => `error: ${err.message}`,
      success: 'Transaction completed successfully',
    });
  };
  const handleFinish = async (values) => {
    const transferTokenPromise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const resp = await memeServices.transferToken({
          amount: +values.amount,
          reason: values.reason,
          receiverId: receiver.id,
        });
        const txId = resp.data.id;
        setTransactionId(+txId);
        setShowVerify(true);
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        setLoading(false);
      }

    });
    await toast.promise(transferTokenPromise, {
      loading: 'processing...',
      error: err => `error: ${err.message}`,
      success: 'transaction created',
    });
  };
  const handleFinishFailed = (err) => {
    toast.error('Please check form value then try again');
  };

  return (
    <Modal
      title='Transfer token to user'
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={showVerify ? [
        <Button key='back' onClick={handleCancelVerify} disabled={loading}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleVerifyTransaction} disabled={loading}>
          {loading ? 'Verifying...' : 'Send'}
        </Button>,
      ] : [
        <Button key='back' onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleTransfer} disabled={loading}>
          {loading ? 'Processing' : 'Transfer'}
        </Button>,
      ]}
    >
      {
        showVerify ? (
          <div className='modal-content-otp'>
            {
              isLoading ? <Skeleton /> : error ? <p>Some error has occurred</p> : (
                <>
                  <div className='modal-title'>
                    Please enter the verification OTP sent to your email: {sender.username}
                  </div>
                  <OtpInput
                    value={otp}
                    onChange={handleChange}
                    separator={<span><strong></strong></span>}
                    numInputs={6}
                    inputStyle={{
                      width: '3rem',
                      height: '3rem',
                      margin: '0 1rem',
                      fontSize: '2rem',
                      borderRadius: 4,
                      border: '1px solid rgba(0,0,0,0.3)',
                    }}
                  />
                </>
              )
            }
          </div>
        ) : (
          <>
            {
              isLoading ? (<Skeleton />) : error ? (<p>Some error has occurred</p>) : (
                <div className='modal-content-token'>
                  <div className='modal-avatar'>
                    <img src={receiver?.avatar || '/images/default-avatar.jpg'} alt='avatar' />
                  </div>
                  <div className='modal-user'>{receiver?.fullName || 'No name'}</div>
                  <div className='modal-valid-token'>Your valid Token: {sender.tokenBalance.toLocaleString()}</div>
                  Insert tokens number you want to send
                  <Form
                    name='transferToken'
                    onFinish={handleFinish}
                    onFinishFailed={handleFinishFailed}
                    form={form}
                  >
                    <Form.Item
                      name='amount'
                      rules={[
                        { required: true, message: 'please enter amount' },
                      ]}
                    >
                      <div className='modal-input-token'>
                        <input type='number' placeholder='50 tokens' />
                      </div>
                    </Form.Item>
                    <Form.Item
                      name='reason'
                      rules={[{ required: true, message: 'please enter reason' }]}
                    >
                      <div className='modal-input-message'>
                        <input type='text' placeholder='Transfer reason' />
                      </div>
                    </Form.Item>
                  </Form>
                </div>
              )
            }
          </>
        )
      }
    </Modal>
  );
};

export default ModalTransferToken;
