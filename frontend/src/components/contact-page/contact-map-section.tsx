function ContactMapSection() {
  return (
    <div className="w-full h-[450px] lg:h-[500px] overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d45330.445498399495!2d105.60946185021041!3d9.910945320174955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1746947888113!5m2!1svi!2s"
        height="100%"
        width="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map Location"
      ></iframe>
    </div>
  );
}
export default ContactMapSection;
