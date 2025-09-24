function NoChatSelected() {
   return (
      <div className="bg-base-100/50 flex w-full flex-1 flex-col items-center justify-center p-16">
         <div className="max-w-md space-y-6 text-center">
            {/* Icon Display */}
            <div className="mb-4 flex justify-center gap-4">
               <div className="relative">
                  <div className="size-20 animate-bounce">
                     <img src="/logo.svg" />
                  </div>
               </div>
            </div>

            {/* Welcome Text */}
            <h2 className="text-2xl font-bold">Welcome to HelloSphere!</h2>
            <p className="text-base-content/60">Select a conversation from the sidebar to start chatting</p>
         </div>
      </div>
   );
}

export default NoChatSelected;
