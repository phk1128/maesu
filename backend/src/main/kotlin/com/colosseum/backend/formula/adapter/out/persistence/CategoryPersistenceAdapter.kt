package com.colosseum.backend.formula.adapter.out.persistence

import com.colosseum.backend.formula.application.port.out.LoadCategoryPort
import com.colosseum.backend.formula.domain.Area
import com.colosseum.backend.formula.domain.Category
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository

@Repository
class CategoryPersistenceAdapter(
    private val categoryJpaRepository: CategoryJpaRepository,
) : LoadCategoryPort {

    override fun loadAll(): List<Category> =
        categoryJpaRepository.findAllByOrderBySortOrderAsc().map { it.toDomain() }

    override fun loadById(id: Long): Category? =
        categoryJpaRepository.findByIdOrNull(id)?.toDomain()

    private fun CategoryJpaEntity.toDomain() = Category.of(
        id = id,
        area = Area.fromDisplayName(area),
        name = name,
        sortOrder = sortOrder,
    )
}