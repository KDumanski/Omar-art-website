import { redirect } from 'next/navigation';

// Paintings are now part of the combined "Paintings & Shows" section.
// Send any old /paintings traffic there.
export default function PaintingsPage() {
  redirect('/shows');
}
