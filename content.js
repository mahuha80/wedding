/*
 * Chỉnh nội dung ở đây. Để trống ngày, giờ, địa điểm hoặc ảnh chưa được xác nhận.
 * Ảnh đặt trong assets/photos/ rồi điền đường dẫn tương đối, ví dụ:
 * heroPhoto: "./assets/photos/anh-bia.jpg"
 * Không điền dữ liệu khách mời hoặc thông tin riêng tư vào file công khai này.
 */
window.WEDDING_CONTENT = {
  bride: "Giang Thanh",
  groom: "Thành Vinh",
  pageTitle: "Thành Vinh & Giang Thanh — Lời mời cưới",
  heroMessage: "Một ngày thật đẹp sẽ trọn vẹn hơn khi có bạn ở bên.",
  heroPhoto: "",
  // Bản thu CC0 của Membeth; thay bằng tệp có giấy phép phù hợp nếu muốn đổi nhạc.
  musicSrc: "./assets/audio/venetian-gondola-song.mp3",
  // Chỉ điền khi đã xác nhận; ví dụ "Chủ nhật, 15.11.2026".
  dateLine: "",
  locationLine: "",
  invitationMessage: "Chúng mình trân trọng mời bạn đến chung vui trong ngày đặc biệt. Sự hiện diện của bạn là món quà đáng quý nhất đối với chúng mình.",
  storyMessage: "Những khoảnh khắc nhỏ đã đưa chúng mình đến ngày hôm nay. Phần này sẽ được kể bằng những bức ảnh yêu thích của hai đứa.",
  photos: [
    // { src: "./assets/photos/anh-01.jpg", alt: "Hai bạn trong bộ ảnh cưới", caption: "Những ngày bên nhau" },
    // { src: "./assets/photos/anh-02.jpg", alt: "Khoảnh khắc tự nhiên của hai bạn", caption: "Một khoảnh khắc đáng nhớ" }
  ],
  events: [
    {
      title: "Lễ thành hôn",
      label: "THE CEREMONY",
      date: "",
      arrival: "",
      start: "",
      venue: "",
      address: "",
      // Dán link chỉ đường đã kiểm tra đúng ghim; để trống sẽ ẩn nút.
      mapUrl: ""
    },
    // Chỉ thêm lễ ăn hỏi nếu buổi lễ này mời đúng nhóm khách xem trang công khai.
    // { title: "Lễ ăn hỏi", label: "THE ENGAGEMENT", date: "", arrival: "", start: "", venue: "", address: "", mapUrl: "" }
  ]
};
