import ChatContainer from '../components/ChatContainer';
import NoChatSelected from '../components/NoChatSelected';
import Sidebar from '../components/Sidebar';
import { useChatStore } from '../store/useChatStore';

function HomePage() {
   const { selectedUser } = useChatStore();

   return (
      <div className="bg-base-200 min-h-screen">
         <div className="flex items-center justify-center px-4 pt-20">
            <div className="bg-base-100 shadow-cl h-[calc(100vh-8rem)] w-full max-w-6xl rounded-lg">
               <div className="flex h-full overflow-hidden rounded-lg">
                  <Sidebar />

                  {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
               </div>
            </div>
         </div>
      </div>
   );
}

export default HomePage;
