"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugSearch = void 0;
const slugSearch = (keyword) => {
    if (!keyword)
        return "";
    const key = String(keyword)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const slug = key.trim().replace(/\s+/g, "-");
    return slug;
};
exports.slugSearch = slugSearch;
