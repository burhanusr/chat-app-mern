import { Image, Send, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useChatStore } from '../store/useChatStore';

function MessageInput() {
   const [text, setText] = useState('');
   const [imagePreview, setImagePreview] = useState('');
   const { sendMessage } = useChatStore();

   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file?.type?.startsWith('image/')) {
         toast.error('Please select an image file');
         return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
         const base64Image = reader.result as string;
         setImagePreview(base64Image);
      };
   };

   const removeImage = () => {
      setImagePreview('');
   };

   const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!text.trim() && !imagePreview) return;

      try {
         await sendMessage({
            text: text.trim(),
            image: imagePreview
         });

         // Clear form
         setText('');
         setImagePreview('');
      } catch (error) {
         console.error('Failed to send message:', error);
      }
   };

   return (
      <div className="w-full p-4">
         {imagePreview && (
            <div className="mb-3 flex items-center gap-2">
               <div className="relative">
                  <img src={imagePreview} alt="Preview" className="h-20 w-20 rounded-lg border border-zinc-700 object-cover" />
                  <button
                     onClick={removeImage}
                     className="bg-base-300 absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full"
                     type="button"
                  >
                     <X className="size-3" />
                  </button>
               </div>
            </div>
         )}

         <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex flex-1 gap-2">
               <input
                  type="text"
                  className="input input-bordered input-sm sm:input-md w-full rounded-lg"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
               />

               {/* Image upload button */}
               <label htmlFor="image-upload" className="btn btn-circle hidden sm:flex">
                  <Image size={20} className={`${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`} />
                  <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
               </label>
            </div>
            <button type="submit" className="btn btn-sm btn-circle" disabled={!text.trim() && !imagePreview}>
               <Send size={22} />
            </button>
         </form>
      </div>
   );
}

export default MessageInput;
