import { Github, Twitter, Linkedin, Bot } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-20 px-6 border-t border-white/10 bg-deep-navy">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-electric-blue rounded-xl flex items-center justify-center">
                            <Bot className="text-white" size={24} />
                        </div>
                        <span className="font-bold text-2xl tracking-tight">AI Screen<span className="text-electric-blue">.</span></span>
                    </div>
                    <p className="text-slate-400 max-w-sm mb-8">
                        The future of recruitment is here. Efficient, accurate, and fair AI-powered resume screening for modern teams.
                    </p>
                    <div className="flex gap-4">
                        {[Github, Twitter, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-slate-300">
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-6">Product</h4>
                    <ul className="space-y-4 text-slate-400">
                        <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                        <li><a href="#workflow" className="hover:text-blue-400 transition-colors">Workflow</a></li>
                        <li><a href="#demo" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">API Docs</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-6">Company</h4>
                    <ul className="space-y-4 text-slate-400">
                        <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/5 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} AI Screen. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
