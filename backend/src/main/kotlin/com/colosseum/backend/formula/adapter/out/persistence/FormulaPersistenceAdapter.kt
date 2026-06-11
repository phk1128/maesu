package com.colosseum.backend.formula.adapter.out.persistence

import com.colosseum.backend.formula.application.port.out.LoadCategoryPort
import com.colosseum.backend.formula.application.port.out.LoadFormulaPort
import com.colosseum.backend.formula.domain.Formula
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository

@Repository
class FormulaPersistenceAdapter(
    private val formulaJpaRepository: FormulaJpaRepository,
    private val loadCategoryPort: LoadCategoryPort,
) : LoadFormulaPort {

    override fun loadByCategoryId(categoryId: Long): List<Formula> {
        val category = loadCategoryPort.loadById(categoryId) ?: return emptyList()
        return formulaJpaRepository.findByCategoryIdOrderBySortOrderAsc(categoryId)
            .map { it.toDomain(category) }
    }

    override fun loadById(id: Long): Formula? {
        val entity = formulaJpaRepository.findByIdOrNull(id) ?: return null
        val category = loadCategoryPort.loadById(entity.categoryId) ?: return null
        return entity.toDomain(category)
    }

    private fun FormulaJpaEntity.toDomain(category: com.colosseum.backend.formula.domain.Category) = Formula.of(
        id = id,
        category = category,
        title = title,
        contentMd = contentMd,
        svg = svg,
        sortOrder = sortOrder,
    )
}