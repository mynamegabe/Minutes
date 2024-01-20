export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col px-4 gap-4 py-0">
			{children}
		</section>
	);
}
