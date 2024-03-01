import styles from './style.module.css';

type UploadButtonProps = {
	isValidFileType: boolean;
	handleFileUpload: (file?: File) => void;
};

export const UploadZone: React.FC<UploadButtonProps> = ({
	handleFileUpload,
	isValidFileType,
}) => {
	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();

		const fileArray = Array.from(e.dataTransfer.files);
		handleFileUpload(fileArray[0]);
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e?.target?.files?.[0];

		handleFileUpload(file);
	};

	return (
		<div
			className={styles.dragableZone}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			<h2>Drag & Drop file</h2>
			<h3>Or</h3>
			<button className={styles.uploadBtn}>
				<input
					type="file"
					id="upload"
					onChange={handleFileInputChange}
					accept=".csv"
					hidden
				/>
				<label htmlFor="upload">Choose file</label>
			</button>
			{!isValidFileType ? (
				<p className={styles.warning}>Invalid file type</p>
			) : null}
		</div>
	);
};
