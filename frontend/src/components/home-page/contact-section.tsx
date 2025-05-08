import { Facebook, Phone, MapPin, Clock } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="bg-gray-100 py-16" id="contact">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Liên hệ với chúng tôi
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="text-blue-600" />
              <div>
                <h4 className="font-semibold">Địa chỉ</h4>
                <p>123 Đường Nguyễn Văn Cừ, Quận 5, TP. HCM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="text-blue-600" />
              <div>
                <h4 className="font-semibold">Hotline</h4>
                <a href="tel:0123456789" className="text-blue-600 underline">
                  0123 456 789
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="text-blue-600" />
              <div>
                <h4 className="font-semibold">Giờ làm việc</h4>
                <p>Thứ 2 - Chủ Nhật: 8:00 - 20:00</p>
              </div>
            </div>

            <div className="flex gap-6 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-6 h-6 hover:text-blue-700 transition" />
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/zalo-icon.png"
                  alt="Zalo"
                  className="w-6 h-6 hover:opacity-80 transition"
                />
              </a>
            </div>
          </div>

          <div className="w-full h-[300px] md:h-full">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2497746976566!2d106.6799836153345!3d10.791517161858927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175292aa5b5d4b1%3A0xb497d880e6c9b450!2zMTIzIE5ndXnhu4VuIFbEg24gQ-G7rywgUXXDoW4gNSwgVGjDoG5oIHBo4buRIFRow6BuaCBQaOG7pywgSOG7kyBDaMOidQ!5e0!3m2!1sen!2s!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
