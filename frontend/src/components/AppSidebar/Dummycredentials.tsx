import { Copy, Eye, EyeOff} from "lucide-react";
import { useState } from "react";

const DummyCredentials = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const credentials = {
    rollNumber: "2001BEC0001",
    password: "111111"
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="md:flex flex-col fixed right-6 bottom-6 z-30 group">
      {/* Main credentials card */}
      <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6 w-80 text-white overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-3xl">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl" />
        
        {/* Header */}
        <div className="relative flex items-center space-x-3 mb-6">
        
          <div>
            <h3 className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Demo Credentials
            </h3>
          </div>
        </div>

        {/* Credentials */}
        <div className="relative space-y-4">
          {/* Roll Number */}
          <div className="group/item">
        
            <div className="relative">
              <button
                onClick={() => copyToClipboard(credentials.rollNumber, 'rollNumber')}
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/30 rounded-xl transition-all duration-300 group/copy"
              >
                <span className="font-mono text-blue-300 group-hover/copy:text-blue-200">
                  {credentials.rollNumber}
                </span>
                <div className="flex items-center space-x-2">
                  {copiedField === 'rollNumber' ? (
                    <span className="text-xs text-green-400 font-medium">Copied!</span>
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 group-hover/copy:text-blue-400 transition-colors" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="group/item">
           
            <div className="relative">
              <button
                onClick={() => copyToClipboard(credentials.password, 'password')}
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 rounded-xl transition-all duration-300 group/copy"
              >
                <span className="font-mono text-purple-300 group-hover/copy:text-purple-200">
                  {showPassword ? credentials.password : '••••••'}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPassword(!showPassword);
                    }}
                    className="p-1 hover:bg-white/10 rounded-md transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400 hover:text-purple-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400 hover:text-purple-400" />
                    )}
                  </button>
                  {copiedField === 'password' ? (
                    <span className="text-xs text-green-400 font-medium">Copied!</span>
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 group-hover/copy:text-purple-400 transition-colors" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

     

     </div>
    </div>
  );
};

export default DummyCredentials;
