/**
 * @file SkeletonLoader.tsx
 * @description Animated skeleton loader for user cards.
 *
 * @see {@link ./UserList.tsx}
 * @see {@link ../App.css}
 */

type SkeletonLoaderProps = {
  count?: number;
};

/**
 * Renders an animated skeleton loader for user cards.
 *
 * @description
 * This component generates a grid of placeholder cards to display while data is being fetched.
 * It uses the `count` prop to construct an array of empty elements using `Array.from`.
 * For each element, it renders a skeleton card structure with animated background lines 
 * to provide a visual loading indicator to the user.
 */
export default function SkeletonLoader({ count = 6 }: SkeletonLoaderProps) {
  return (
    <div className="user-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="user-card skeleton-card">
          <div className="skeleton-line title" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-actions" />
        </div>
      ))}
    </div>
  );
}
