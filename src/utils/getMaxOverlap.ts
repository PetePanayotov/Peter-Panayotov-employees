import moment from 'moment';
import { EmployeesData } from '../App';

const emptyValues = ['NULL', '', null, 'NULL\r'];

type ProjectData = {
	projectId: string;
	fromDate: string;
	toDate: string | null;
};

type OverlapingProjects = {
	projectId: string;
	overlap: number;
};

export type OutputType = {
	firstEmployeeId: string | null;
	secondEmpolyeeId: string | null;
	totalOverlap: number;
	overlapingProjects: OverlapingProjects[];
};

const calculateOverlap = (
	firstEmployeeProject: ProjectData,
	secondEmployeeProject: ProjectData
) => {
	const startDate = moment.max(
		moment(firstEmployeeProject.fromDate),
		moment(secondEmployeeProject.fromDate)
	);
	const endDate = moment.min(
		moment(firstEmployeeProject.toDate || moment(), 'YYYY-MM-DD'),
		moment(secondEmployeeProject.toDate || moment(), 'YYYY-MM-DD')
	);
	return endDate.diff(startDate, 'days');
};

const hasOverlap = (
	firstEmployeeProject: ProjectData,
	secondEmployeeProject: ProjectData
) => {
	const startDate1 = moment(firstEmployeeProject.fromDate);
	const endDate1 = moment(firstEmployeeProject.toDate);
	const startDate2 = moment(secondEmployeeProject.fromDate);
	const endDate2 = moment(secondEmployeeProject.toDate);

	return (
		(startDate1.isBefore(endDate2) && endDate1.isAfter(startDate2)) ||
		(startDate2.isBefore(endDate1) && endDate2.isAfter(startDate1)) ||
		(startDate1.isSameOrBefore(startDate2) && endDate1.isAfter(startDate2)) ||
		(startDate2.isSameOrBefore(startDate1) && endDate2.isAfter(startDate1))
	);
};

const findOverlapingProjects = (
	fEmProjectList: ProjectData[],
	sEmProjectList: ProjectData[]
) => {
	let overlapingProjectsData: {
		overlapingProjects: OverlapingProjects[];
		totalOverlap: number;
	} = {
		overlapingProjects: [],
		totalOverlap: 0,
	};

	for (const fEmProject of fEmProjectList) {
		for (const sEmProject of sEmProjectList) {
			if (fEmProject.projectId !== sEmProject.projectId) continue;

			const isOverlaping = hasOverlap(fEmProject, sEmProject);

			if (!isOverlaping) continue;

			const overlap = calculateOverlap(fEmProject, sEmProject);

			overlapingProjectsData = {
				overlapingProjects: [
					...overlapingProjectsData.overlapingProjects,
					{ projectId: fEmProject.projectId, overlap },
				],
				totalOverlap: overlapingProjectsData.totalOverlap + overlap,
			};
		}
	}
	return overlapingProjectsData;
};

const getFormatedTodayDate = (today: Date) => {
	return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

const transformData = (input: EmployeesData[]) => {
	let data: Record<string, ProjectData[]> = {};

	for (let i = 0; i < input.length; i++) {
		const { employeeId, projectId, fromDate, toDate } = input[i];

		const isToDateEmpty = emptyValues.includes(toDate);

		const projectData = {
			projectId,
			fromDate,
			toDate: isToDateEmpty ? getFormatedTodayDate(new Date()) : toDate,
		};

		if (employeeId in data) {
			data[employeeId] = [...data[employeeId], projectData];
		} else {
			data[employeeId] = [projectData];
		}
	}
	return data;
};

export const getMaxOverlap = (input: EmployeesData[]) => {
	const transformedData = transformData(input);

	const employeeIds = Object.keys(transformedData);

	let currenMaxOverlap: OutputType = {
		firstEmployeeId: null,
		secondEmpolyeeId: null,
		totalOverlap: 0,
		overlapingProjects: [],
	};

	for (let i = 0; i < employeeIds.length; i++) {
		const currentEmployeeId = employeeIds[i];
		const currentEmployeeProjects = transformedData[currentEmployeeId];

		for (let j = i + 1; j < employeeIds.length; j++) {
			const nextEmployeeId = employeeIds[j];
			const nextEmployeeProjects = transformedData[nextEmployeeId];

			const { overlapingProjects, totalOverlap } = findOverlapingProjects(
				currentEmployeeProjects,
				nextEmployeeProjects
			);

			if (!overlapingProjects.length) continue;

			if (totalOverlap > currenMaxOverlap.totalOverlap) {
				currenMaxOverlap = {
					firstEmployeeId: currentEmployeeId,
					secondEmpolyeeId: nextEmployeeId,
					totalOverlap,
					overlapingProjects,
				};
			}
		}
	}
	return currenMaxOverlap;
};
