
exports.getRelativeTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); 
  
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  
    return `${Math.floor(diff / 31536000)} years ago`;
  };
  
  exports.formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return date.toLocaleDateString("id-ID", options);
  };
  