class CheckerRouter:

    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'intranet':
            return 'intranet_db'
        if model._meta.app_label == 'calc_cabos':
            return 'calc_cabos_db'
        if model._meta.app_label == 'e3d_info':
            return 'e3d_info_db'
        elif model._meta.app_label == 'eletrica':
            return 'a1pro_db'
        elif model._meta.app_label == 'pmo':
            return 'a1pmo_db'
        elif model._meta.app_label == 'energia':
            return 'a1energia_db'
        elif model._meta.app_label == 'a1hist':
            return 'a1hist_db'
        elif model._meta.app_label == 'msys':
            return 'msys_db'
        elif model._meta.app_label == 'a1hub':
            return 'a1hub_db'
        elif model._meta.app_label == 'sgq':
            return 'a1sgq_db'
        elif model._meta.app_label == 'flexibilidade':
            return 'a1flx_db'
        elif model._meta.app_label == 'civil':
            return 'a1civ_db'
        elif model._meta.app_label == 'documentacao':
            return 'default'
        elif model._meta.app_label == 'materials':
            return 'materials_db'
        elif model._meta.app_label == 'comos_a1pro':
            return 'comos_a1pro_db'
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'intranet':
            return 'intranet_db'
        if model._meta.app_label == 'calc_cabos':
            return 'calc_cabos_db'
        if model._meta.app_label == 'e3d_info':
            return 'e3d_info_db'
        elif model._meta.app_label == 'eletrica':
            return 'a1pro_db'
        elif model._meta.app_label == 'pmo':
            return 'a1pmo_db'
        elif model._meta.app_label == 'energia':
            return 'a1energia_db'
        elif model._meta.app_label == 'a1hist':
            return 'a1hist_db'
        elif model._meta.app_label == 'msys':
            return 'msys_db'
        elif model._meta.app_label == 'a1hub':
            return 'a1hub_db'
        elif model._meta.app_label == 'sgq':
            return 'a1sgq_db'
        elif model._meta.app_label == 'flexibilidade':
            return 'a1flx_db'
        elif model._meta.app_label == 'civil':
            return 'a1civ_db'
        elif model._meta.app_label == 'documentacao':
            return 'default'
        elif model._meta.app_label == 'materials':
            return 'materials_db'
        elif model._meta.app_label == 'comos_a1pro':
            return 'comos_a1pro_db'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'intranet' or obj2._meta.app_label == 'intranet':
            return True
        if obj1._meta.app_label == 'calc_cabos' or obj2._meta.app_label == 'calc_cabos':
            return True
        if obj1._meta.app_label == 'e3d_info' or obj2._meta.app_label == 'e3d_info':
            return True
        elif 'intranet' not in [obj1._meta.app_label, obj2._meta.app_label]:
            return True
        elif obj1._meta.app_label == 'a1hub' or obj2._meta.app_label == 'a1hub':
            return True
        elif 'a1hub' not in [obj1._meta.app_label, obj2._meta.app_label]:
            return True
        elif obj1._meta.app_label == 'eletrica' or obj2._meta.app_label == 'eletrica':
            return True
        elif obj1._meta.app_label == 'sgq' or obj2._meta.app_label == 'sgq':
            return True
        elif 'a1pro' not in [obj1._meta.app_label, obj2._meta.app_label]:
            return True
        elif obj1._meta.app_label == 'pmo' or obj2._meta.app_label == 'pmo':
            return True
        elif 'pmo' not in [obj1._meta.app_label, obj2._meta.app_label]:
            return True
        elif obj1._meta.app_label == 'flexibilidade' or obj2._meta.app_label == 'flexibilidade':
            return True
        elif obj1._meta.app_label == 'civil' or obj2._meta.app_label == 'civil':
            return True
        elif 'flexibilidade' not in [obj1._meta.app_label, obj2._meta.app_label]:
            return True
        elif 'documentacao' not in [obj1._meta.app_label, obj2._meta.app_label]:
            return True
        elif 'materials' not in [obj1._meta.app_label, obj2._meta.app_label]:
            return True
        elif 'comos_a1pro' not in [obj1._meta.app_label, obj2._meta.app_label]:
            return True
        return False

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'eletrica':
            return db == 'a1pro_db'
        if app_label == 'calc_cabos':
            return db == 'calc_cabos_db'
        if app_label == 'e3d_info':
            return db == 'e3d_info_db'
        if app_label == 'pmo':
            return db == 'a1pmo_db'
        elif app_label == 'energia':
            return db == 'a1energia_db'
        elif app_label == 'intranet':
            return db == 'intranet_db'
        elif app_label == 'a1hist':
            return db == 'a1hist_db'
        elif app_label == 'msys':
            return db == 'msys_db'
        elif app_label == 'a1hub':
            return db == 'a1hub_db'
        elif app_label == 'flexibilidade':
            return db == 'a1flx_db'
        elif app_label == 'civil':
            return db == 'a1civ_db'
        elif app_label == 'sgq':
            return db == 'a1sgq_db'
        elif app_label == 'materials':
            return db == 'materials_db'
        elif app_label == 'comos_a1pro':
            return db == 'comos_a1pro_db'
        elif app_label == 'documentacao':
            return 'default'
        return None
