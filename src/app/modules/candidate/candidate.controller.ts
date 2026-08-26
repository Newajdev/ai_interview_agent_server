import type { NextFunction, Request, Response } from "express";
import {
	createCandidate,
	deleteCandidate,
	getCandidate,
	listCandidates,
	updateCandidate,
} from "./candidate.service";

function sendNotFound(response: Response) {
	response.status(404).json({ error: "Candidate not found." });
}

function candidateId(request: Request, response: Response) {
	const id = request.params.id;
	if (typeof id !== "string") {
		response.status(400).json({ error: "A valid candidate id is required." });
		return null;
	}
	return id;
}

export async function createCandidateController(request: Request, response: Response, next: NextFunction) {
	try {
		const candidate = await createCandidate(request.body);
		response.status(201).json({ candidate });
	} catch (error) {
		next(error);
	}
}

export async function listCandidatesController(_request: Request, response: Response, next: NextFunction) {
	try {
		response.json({ candidates: await listCandidates() });
	} catch (error) {
		next(error);
	}
}

export async function getCandidateController(request: Request, response: Response, next: NextFunction) {
	try {
		const id = candidateId(request, response);
		if (!id) return;
		const candidate = await getCandidate(id);
		if (!candidate) return sendNotFound(response);
		response.json({ candidate });
	} catch (error) {
		next(error);
	}
}

export async function updateCandidateController(request: Request, response: Response, next: NextFunction) {
	try {
		const id = candidateId(request, response);
		if (!id) return;
		const candidate = await updateCandidate(id, request.body);
		response.json({ candidate });
	} catch (error) {
		next(error);
	}
}

export async function deleteCandidateController(request: Request, response: Response, next: NextFunction) {
	try {
		const id = candidateId(request, response);
		if (!id) return;
		await deleteCandidate(id);
		response.status(204).send();
	} catch (error) {
		next(error);
	}
}
