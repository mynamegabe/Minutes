export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-row px-0 gap-0 py-0 border-t dark:border-gray-500">
			{children}
		</section>
	);
}
