export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col items-center h-full gradient-bg justify-center gap-4 py-8 pb-24 md:py-10">
			<div className="inline-block text-center justify-center w-full">
				{children}
			</div>
		</section>
	);
}
