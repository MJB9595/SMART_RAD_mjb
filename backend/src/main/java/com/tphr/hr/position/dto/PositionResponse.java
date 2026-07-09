package com.tphr.hr.position.dto;

import com.tphr.hr.position.Position;

public record PositionResponse(
		Long id,
		String name,
		int sortOrder,
		boolean active
) {

	public static PositionResponse from(Position position) {
		return new PositionResponse(position.getId(), position.getName(), position.getSortOrder(), position.isActive());
	}
}
