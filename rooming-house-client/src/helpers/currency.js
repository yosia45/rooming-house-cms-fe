function formatRupiah(value) {
  if (typeof value !== "number") value = Number(value);

  return `Rp ${value.toLocaleString("id-ID")}`;
  }

export { formatRupiah };