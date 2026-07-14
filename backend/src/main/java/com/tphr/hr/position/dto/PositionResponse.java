package com.tphr.hr.position.dto;

import com.tphr.hr.position.Position;
import com.tphr.hr.position.PositionCategory;

public record PositionResponse(
		Long id,
		String name,
		PositionCategory category,
		int sortOrder,
		boolean active
) {

	public static PositionResponse from(Position position) {
		return new PositionResponse(position.getId(), position.getName(), position.getCategory(),
				position.getSortOrder(), position.isActive());
	}
}
