'use client';

type Props = {
  productId: string;
};

export default function ProductActions({ productId }: Props) {
  const handleDelete = async () => {
    const ok = confirm('Are you sure you want to delete this product?');
    if (!ok) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
        {
          method: 'DELETE',
        }
      );

      if (!res.ok) {
        alert('Failed to delete product');
        return;
      }

      // simplest + safest for now
      window.location.reload();
    } catch {
      alert('Something went wrong');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}
