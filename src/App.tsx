import { useMemo, useState } from 'react';
import './App.css';
import { getMaxOverlap } from './utils/getMaxOverlap';
import { Tabel } from './components/Table';
import { UploadZone } from './components/UploadZone';

export type EmployeesData = {
	employeeId: string;
	projectId: string;
	fromDate: string;
	toDate: string;
};

function App() {
	const [isValidFileType, setIsValidFileType] = useState(true);
	const [csvData, setCSVData] = useState<EmployeesData[]>([]);

	function parseCSV(csvString: string | ArrayBuffer | null | undefined) {
		if (typeof csvString === 'string') {
			const rows = csvString.split('\n');
			const data = rows.map((row) => row.split(','));
			data.shift();
			return data;
		}

		return [];
	}

	const handleFileUpload = (file?: File) => {
		if (file && file?.type !== 'text/csv') {
			return setIsValidFileType(false);
		}
		const reader = new FileReader();

		reader.onload = function (e) {
			const content = e?.target?.result;
			const data = parseCSV(content);
			const mappedData: EmployeesData[] = data.map((entry) => ({
				employeeId: entry[0],
				projectId: entry[1],
				fromDate: entry[2],
				toDate: entry[3],
			}));
			setIsValidFileType(true);
			setCSVData(mappedData);
		};

		reader.readAsText(file);
	};

	const maxOverlap = useMemo(() => getMaxOverlap(csvData), [csvData]);

	return (
		<div className="page-wrapper">
			<UploadZone
				handleFileUpload={handleFileUpload}
				isValidFileType={isValidFileType}
			/>
			<Tabel data={maxOverlap} />
		</div>
	);
}

export default App;

