import { Loader2, RotateCw, RefreshCw } from 'lucide-react';

const SpinningLoadingIcons = () => {
   return (
      <div className="min-h-screen bg-black p-8 space-y-12">
         <h1 className="text-3xl font-bold text-white text-center mb-12">
            Spinning Loading Icons
         </h1>

         {/* Method 1: Lucide Icons with animate-spin */}
         <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">1. Lucide Icons (Recommended)</h2>
            <div className="flex items-center gap-8 flex-wrap">

               {/* Loader2 - Most common */}
               <div className="text-center">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Loader2</p>
               </div>

               {/* RotateCw */}
               <div className="text-center">
                  <RotateCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-400">RotateCw</p>
               </div>

               {/* RefreshCw */}
               <div className="text-center">
                  <RefreshCw className="w-8 h-8 text-green-400 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-400">RefreshCw</p>
               </div>

               {/* Different sizes */}
               <div className="text-center">
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Small</p>
               </div>

               <div className="text-center">
                  <Loader2 className="w-12 h-12 text-red-400 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Large</p>
               </div>
            </div>
         </section>

         {/* Method 2: CSS Border Spinner */}
         <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">2. CSS Border Spinners</h2>
            <div className="flex items-center gap-8 flex-wrap">

               {/* Basic border spinner */}
               <div className="text-center">
                  <div className="w-8 h-8 border-4 border-gray-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-400">Basic</p>
               </div>

               {/* Dotted border */}
               <div className="text-center">
                  <div className="w-8 h-8 border-4 border-dotted border-gray-600 border-t-purple-400 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-400">Dotted</p>
               </div>

               {/* Thick border */}
               <div className="text-center">
                  <div className="w-8 h-8 border-8 border-gray-700 border-t-green-400 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-400">Thick</p>
               </div>

               {/* Gradient effect */}
               <div className="text-center">
                  <div className="w-8 h-8 border-4 border-transparent bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-spin mx-auto mb-2 relative">
                     <div className="w-full h-full bg-black rounded-full absolute top-0 left-0 m-1"></div>
                  </div>
                  <p className="text-sm text-gray-400">Gradient</p>
               </div>
            </div>
         </section>

         {/* Method 3: Pulsing Dots */}
         <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">3. Pulsing Dots</h2>
            <div className="flex items-center gap-8 flex-wrap">

               {/* Three dots */}
               <div className="text-center">
                  <div className="flex space-x-1 mx-auto mb-2 w-fit">
                     <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                     <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                     <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <p className="text-sm text-gray-400">Dots</p>
               </div>

               {/* Bouncing dots */}
               <div className="text-center">
                  <div className="flex space-x-1 mx-auto mb-2 w-fit">
                     <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                     <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-sm text-gray-400">Bounce</p>
               </div>
            </div>
         </section>

         {/* Method 4: Custom Animations */}
         <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">4. Custom Spinners</h2>
            <div className="flex items-center gap-8 flex-wrap">

               {/* Double ring */}
               <div className="text-center">
                  <div className="relative w-8 h-8 mx-auto mb-2">
                     <div className="absolute inset-0 border-2 border-gray-600 border-t-cyan-400 rounded-full animate-spin"></div>
                     <div className="absolute inset-1 border-2 border-gray-700 border-b-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                  </div>
                  <p className="text-sm text-gray-400">Double Ring</p>
               </div>

               {/* Pulse ring */}
               <div className="text-center">
                  <div className="relative w-8 h-8 mx-auto mb-2">
                     <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping"></div>
                     <div className="absolute inset-2 bg-cyan-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-400">Pulse Ring</p>
               </div>
            </div>
         </section>

         {/* Usage Examples */}
         <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">5. Usage in Buttons</h2>
            <div className="flex gap-4 flex-wrap">

               {/* Loading button */}
               <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors" disabled>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
               </button>

               {/* Saving button */}
               <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors" disabled>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
               </button>

               {/* Processing button */}
               <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors" disabled>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing...
               </button>
            </div>
         </section>
      </div>
   );
};

export default SpinningLoadingIcons;