package com.colosseum.backend.formula.application.service

import com.colosseum.backend.formula.application.port.`in`.GetCategoriesUseCase
import com.colosseum.backend.formula.application.port.`in`.GetFormulaUseCase
import com.colosseum.backend.formula.application.port.`in`.GetFormulasByCategoryUseCase
import com.colosseum.backend.formula.application.port.out.LoadCategoryPort
import com.colosseum.backend.formula.application.port.out.LoadFormulaPort
import com.colosseum.backend.formula.domain.Category
import com.colosseum.backend.formula.domain.Formula
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class FormulaQueryService(
    private val loadCategoryPort: LoadCategoryPort,
    private val loadFormulaPort: LoadFormulaPort,
) : GetCategoriesUseCase, GetFormulasByCategoryUseCase, GetFormulaUseCase {

    override fun getCategories(): List<Category> =
        loadCategoryPort.loadAll()

    override fun getFormulasByCategory(categoryId: Long): List<Formula> {
        loadCategoryPort.loadById(categoryId)
            ?: throw NoSuchElementException("카테고리를 찾을 수 없습니다: id=$categoryId")
        return loadFormulaPort.loadByCategoryId(categoryId)
    }

    override fun getFormula(formulaId: Long): Formula =
        loadFormulaPort.loadById(formulaId)
            ?: throw NoSuchElementException("공식을 찾을 수 없습니다: id=$formulaId")
}