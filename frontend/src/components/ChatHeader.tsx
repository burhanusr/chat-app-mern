import { X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

function ChatHeader() {
   const { selectedUser, setSelectedUser } = useChatStore();
   const { onlineUsers } = useAuthStore();

   return (
      <div className="border-base-300 border-b p-2.5">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               {/* Avatar */}
               <div className="avatar">
                  <div className="relative size-10 rounded-full">
                     <img src={selectedUser?.profilePic || '/avatar.png'} alt={selectedUser?.fullName || 'User Avatar'} />
                  </div>
               </div>

               {/* User info */}
               <div>
                  <h3 className="font-medium">{selectedUser?.fullName || 'Unknown User'}</h3>
                  <p className="text-base-content/70 text-sm">{selectedUser && onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}</p>
               </div>
            </div>

            {/* Close button */}
            <button className="cursor-pointer" onClick={() => setSelectedUser(null)} aria-label="Close chat">
               <X />
            </button>
         </div>
      </div>
   );
}

export default ChatHeader;
