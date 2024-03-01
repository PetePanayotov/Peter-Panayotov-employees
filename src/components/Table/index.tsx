import { OutputType } from '../../utils/getMaxOverlap';
import styles from './style.module.css';

type Props = {
	data: OutputType;
};

export const Tabel: React.FC<Props> = ({ data }) => {
	return (
		<table className={styles.table}>
			<thead className={styles.tableHeader}>
				<tr>
					<th className={styles.tableHeaderCell}>Employee ID #1</th>
					<th className={styles.tableHeaderCell}>Employee ID #2</th>
					<th className={styles.tableHeaderCell}>Project ID</th>
					<th className={styles.tableHeaderCell}>Days worked</th>
				</tr>
			</thead>
			<tbody>
				{data.overlapingProjects.map((project) => (
					<tr key={project.projectId}>
						<td className={styles.tableHeaderCell}>{data.firstEmployeeId}</td>
						<td className={styles.tableHeaderCell}>{data.secondEmpolyeeId}</td>
						<td className={styles.tableHeaderCell}>{project.projectId}</td>
						<td className={styles.tableHeaderCell}>{project.overlap}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
