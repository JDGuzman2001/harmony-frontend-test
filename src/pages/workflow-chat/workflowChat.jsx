import Chat from '../../components/chat/chat';
import Header from '../../components/header';
import { useAuth } from '../../context/authContext';

function WorkflowChat() {
  const { handleLogout, userInfo } = useAuth();

  return (
    <div className='flex flex-col justify-start items-center min-h-screen bg-gray-200'>
      <Header title="Chat 🤖" onLogout={handleLogout} />
      <Chat userInfo={userInfo} />
    </div>
  );
}

export default WorkflowChat; 