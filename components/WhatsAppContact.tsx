export default function WhatsAppContact(){
  const phone='201107930397'
  const message='السلام عليكم، محتاج استفسار عن المنصة.'
  return (
    <>
      <a
        className="whatsapp-contact"
        href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا على واتساب"
        title="تواصل معنا على واتساب"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" fill="none">
          <path d="M16 4.5A11.5 11.5 0 0 0 6.1 22l-1.6 5.5 5.7-1.5A11.5 11.5 0 1 0 16 4.5Z" fill="currentColor"/>
          <path d="M12.2 10.8c.3-.4.7-.4 1-.2l1.3 1.7c.2.3.2.7 0 1l-.7.8c.8 1.5 2 2.7 3.5 3.5l.8-.7c.3-.2.7-.2 1 0l1.7 1.3c.3.2.3.7.1 1-.5.8-1.3 1.3-2.2 1.3-3.5-.2-7.8-4.4-8.7-7.7-.3-.9 0-1.7.6-2Z" fill="#fff"/>
        </svg>
        <span>تواصل معنا</span>
      </a>
      <style>{`.whatsapp-contact{position:fixed;right:24px;bottom:24px;z-index:100;display:flex;align-items:center;gap:9px;height:54px;padding:0 17px 0 14px;border-radius:999px;background:#20b968;color:#fff;text-decoration:none;box-shadow:0 12px 28px rgba(25,154,88,.28);font-size:13px;font-weight:900;direction:rtl;transition:transform .2s ease,box-shadow .2s ease}.whatsapp-contact:hover{transform:translateY(-3px);box-shadow:0 16px 34px rgba(25,154,88,.34)}.whatsapp-contact svg{width:29px;height:29px}.whatsapp-contact:after{content:'';position:absolute;inset:-5px;border:2px solid rgba(32,185,104,.18);border-radius:999px;animation:whatsappPulse 2s ease-out infinite;pointer-events:none}@keyframes whatsappPulse{0%{transform:scale(.96);opacity:.9}70%,100%{transform:scale(1.14);opacity:0}}@media(max-width:600px){.whatsapp-contact{right:16px;bottom:16px;width:54px;height:54px;padding:0;justify-content:center}.whatsapp-contact span{display:none}}`}</style>
    </>
  )
}
