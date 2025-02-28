export const slugSearch = (keyword:any) => {
    if (!keyword) return "";

    const key = String(keyword)
        .normalize("NFD") 
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
    const slug = key.trim().replace(/\s+/g, "-");
    return slug
};
